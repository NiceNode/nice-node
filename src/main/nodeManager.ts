/* eslint-disable no-await-in-loop */
import { NodeSpecification } from '../common/nodeSpec';
import {
  getContainerDetails,
  removePodmanNode,
  startPodmanNode,
  stopPodmanNode,
  sendLogsToUI as dockerSendLogsToUI,
  initialize as initDocker,
  onExit as onExitDocker,
  stopSendingLogsToUI as dockerStopSendingLogsToUI,
  createRunCommand,
} from './podman/podman';
import logger from './logger';
import Node, {
  createNode,
  isDockerNode,
  NodeId,
  NodeRuntime,
  NodeStatus,
} from '../common/node';
import * as nodeStore from './state/nodes';
import { deleteDisk, getNodesDirPath, makeNodeDir } from './files';
import {
  startBinary,
  stopBinary,
  initialize as initBinary,
  onExit as onExitBinary,
  getBinaryStatus,
  removeBinaryNode,
  sendLogsToUI as binarySendLogsToUI,
  stopSendingLogsToUI as binaryStopSendingLogsToUI,
  getProcess,
} from './binary';
import { initialize as initNodeLibrary } from './nodeLibraryManager';
import { ConfigValuesMap } from '../common/nodeConfig';

export const addNode = async (
  nodeSpec: NodeSpecification,
  storageLocation?: string,
  initialConfigFromUser?: ConfigValuesMap
): Promise<Node> => {
  // use a timestamp postfix so the user can add multiple nodes of the same name
  const utcTimestamp = Math.floor(Date.now() / 1000);
  const dataDir = await makeNodeDir(
    `${nodeSpec.specId}-${utcTimestamp}`,
    storageLocation ?? getNodesDirPath()
  );
  console.log('adding node with dataDir: ', dataDir);
  const nodeRuntime: NodeRuntime = {
    dataDir,
    usage: {},
  };
  const node: Node = createNode({
    spec: nodeSpec,
    runtime: nodeRuntime,
    initialConfigFromUser,
  });
  nodeStore.addNode(node);
  return node;
};

// Useful for users "ejecting" from using the UI
export const getNodeStartCommand = (nodeId: NodeId): string => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(
      `Unable to get node start command ${nodeId}. Node not found.`
    );
  }

  try {
    if (isDockerNode(node)) {
      const dockerNode = node;
      console.log('creating node start command');
      // startPodmanNode(dockerNode);
      const startCommand = `podman ${createRunCommand(dockerNode)}`;
      console.log('created node start command', startCommand);

      return startCommand;
    }
  } catch (err) {
    logger.error(err);
  }
  return '';
};

export const startNode = async (nodeId: NodeId) => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(`Unable to start node ${nodeId}. Node not found.`);
  }
  logger.info(`Starting node ${JSON.stringify(node)}`);
  node.status = NodeStatus.starting;
  nodeStore.updateNode(node);

  try {
    if (isDockerNode(node)) {
      const dockerNode = node;
      // startPodmanNode(dockerNode);
      const containerIds = await startPodmanNode(dockerNode);
      dockerNode.runtime.processIds = containerIds;
      dockerNode.status = NodeStatus.running;
      nodeStore.updateNode(dockerNode);
    } else {
      logger.info('nodeManager starting binary node');
      await startBinary(node);
    }
  } catch (err) {
    logger.error(err);
    node.status = NodeStatus.errorStarting;
    nodeStore.updateNode(node);
  }
};

export const stopNode = async (nodeId: NodeId) => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(`Unable to stop node ${nodeId}. Node not found.`);
  }
  logger.info(`Stopping node ${JSON.stringify(node)}`);
  node.status = NodeStatus.stopping;
  nodeStore.updateNode(node);

  try {
    if (isDockerNode(node)) {
      const containerIds = await stopPodmanNode(node);
      logger.info(`${containerIds} stopped`);
      node.status = NodeStatus.stopped;
      nodeStore.updateNode(node);
    } else {
      // assuming binary
      await stopBinary(node);
      node.status = NodeStatus.stopped;
      nodeStore.updateNode(node);
    }
  } finally {
    // don't catch the error, but mark node as stopped
    // todoo: fix this, but for testing it is useful
    node.status = NodeStatus.stopped;
    nodeStore.updateNode(node);
  }
};

export const deleteNodeStorage = async (nodeId: NodeId) => {
  const node = nodeStore.getNode(nodeId);
  const nodeDataDirPath = node.runtime.dataDir;
  const deleteDiskResult = await deleteDisk(nodeDataDirPath);
  logger.info(`Remove node deleteDiskResult ${deleteDiskResult}`);
  return deleteDiskResult;
};

export const removeNode = async (
  nodeId: NodeId,
  options: { isDeleteStorage: boolean }
): Promise<Node> => {
  // todo: check if node can be removed. Is it stopped?
  // todo: stop & remove container
  logger.info(
    `Remove node ${nodeId} and delete storage? ${options.isDeleteStorage}`
  );
  try {
    await stopNode(nodeId);
  } catch (err) {
    logger.info(
      'Unable to stop the node before removing. Continuing with removal.'
    );
  }
  const node = nodeStore.getNode(nodeId);

  // if docker, remove container
  if (isDockerNode(node)) {
    try {
      const isDockerRemoved = await removePodmanNode(node);
      logger.info(`isDockerRemoved ${isDockerRemoved}`);
    } catch (err) {
      logger.error(err);
      // todo: try to remove container with same name?
    }
  } else {
    // assuming binary
    try {
      const isBinaryNode = await removeBinaryNode(node);
      logger.info(`isBinaryNode ${isBinaryNode}`);
    } catch (err) {
      logger.error(err);
    }
  }

  if (options?.isDeleteStorage) {
    await deleteNodeStorage(nodeId);
  }

  // todo: delete data optional
  const removedNode = nodeStore.removeNode(nodeId);
  return removedNode;
};

export const stopSendingNodeLogs = (nodeId?: NodeId) => {
  if (nodeId === undefined) {
    dockerStopSendingLogsToUI();
    binaryStopSendingLogsToUI();
    return;
  }
  const node = nodeStore.getNode(nodeId);
  if (isDockerNode(node)) {
    dockerStopSendingLogsToUI();
  } else {
    // assume binary
    binaryStopSendingLogsToUI();
  }
};

/**
 * Removes all nodes and deletes their storage data
 */
export const removeAllNodes = async () => {
  const nodes = nodeStore.getNodes();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    await removeNode(node.id, { isDeleteStorage: true });
  }
};

export const sendNodeLogs = (nodeId: NodeId) => {
  const node = nodeStore.getNode(nodeId);
  if (isDockerNode(node)) {
    dockerSendLogsToUI(node);
  } else {
    // assume binary
    binarySendLogsToUI(node);
  }
};

/**
 * Called on app launch.
 * Check's node processes and updates internal NiceNode records.
 */
export const initialize = async () => {
  initDocker();
  initBinary();
  initNodeLibrary();

  // get all nodes
  const nodes = nodeStore.getNodes();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isDockerNode(node)) {
      const dockerNode = node;
      if (Array.isArray(dockerNode?.runtime?.processIds)) {
        try {
          const containerDetails = await getContainerDetails(
            dockerNode.runtime.processIds
          );
          console.log(
            'NodeManager.initialize containerDetails: ',
            containerDetails
          );
          // {..."State": {
          //     "Status": "exited",
          //     "Running": false,
          //     "Paused": false,
          //     "Restarting": false,
          //     "OOMKilled": false,
          //     "Dead": false,
          //     "Pid": 0,
          //     "ExitCode": 0,
          //     "Error": "",
          //     "StartedAt": "2022-05-03T00:03:29.261322736Z",
          //     "FinishedAt": "2022-05-03T00:04:03.188681812Z"
          // },
          if (containerDetails?.State?.Running) {
            node.status = NodeStatus.running;
            console.log('checkNode: running', node);
          } else {
            node.status = NodeStatus.stopped;
            console.log('checkNode: stoppeds', node);
          }
          if (containerDetails?.State?.FinishedAt) {
            node.lastStopped = containerDetails?.State?.FinishedAt;
          }
          nodeStore.updateNode(node);
        } catch (err) {
          logger.error(`Docker found no container for nodeId ${node.id}`);
          node.status = NodeStatus.stopped;
          nodeStore.updateNode(node);
        }
      } else {
        throw new Error(`No containerIds found for nodeId ${node.id}`);
      }
    } else {
      // todo: check binary process
      const binaryNode = node;
      if (
        Array.isArray(binaryNode?.runtime?.processIds) &&
        binaryNode.runtime.processIds.length > 0
      ) {
        try {
          const pid = parseInt(binaryNode.runtime.processIds[0], 10);
          // eslint-disable-next-line no-await-in-loop
          const proc = await getProcess(pid);
          if (proc) {
            const nodeStatus = getBinaryStatus(proc);
            logger.info(
              `NodeStatus for ${binaryNode.spec.specId} is ${nodeStatus}`
            );
            node.status = nodeStatus;
            nodeStore.updateNode(node);
          }
        } catch (err) {
          console.error(err);
          node.status = NodeStatus.stopped;
          nodeStore.updateNode(node);
        }
      } else {
        node.status = NodeStatus.errorStopping;
        nodeStore.updateNode(node);
        // no process id so node is lost? set as stopped?
      }
    }
  }
};

export const onExit = () => {
  onExitBinary();
  onExitDocker();
};

// logger.info(
//   `process.env.NN_AUTOSTART_NODE: ${process.env.NN_AUTOSTART_NODE}`
// );
// if (getIsStartOnLogin() || process.env.NN_AUTOSTART_NODE === 'true') {
//   startGeth();
// }
