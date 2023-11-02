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
  NodeStoppedBy,
} from '../common/node';
import * as nodeStore from './state/nodes';
import { deleteDisk, getNodesDirPath, makeNodeDir } from './files';
import { initialize as initNodeLibrary } from './nodeLibraryManager';
import { ConfigValuesMap, ConfigTranslationMap } from '../common/nodeConfig';
import { checkNodePortsAndNotify } from './ports';
import { getNodeLibrary } from './state/nodeLibrary';
import { getSetPortHasChanged } from './state/nodes';

export const addNode = async (
  nodeSpec: NodeSpecification,
  storageLocation?: string,
  initialConfigFromUser?: ConfigValuesMap,
): Promise<Node> => {
  // use a timestamp postfix so the user can add multiple nodes of the same name
  const utcTimestamp = Math.floor(Date.now() / 1000);
  const dataDir = await makeNodeDir(
    `${nodeSpec.specId}-${utcTimestamp}`,
    storageLocation ?? getNodesDirPath(),
  );
  // We really do not want to have conditionals for specific nodes, however,
  //  this is justified as we iterate quickly for funding and prove NN works
  if (nodeSpec.specId === 'hubble') {
    await makeNodeDir('hub', dataDir);
    await makeNodeDir('rocks', dataDir);
  }
  console.log('adding node with dataDir: ', dataDir);
  console.log(
    'adding node with initialConfigFromUser: ',
    initialConfigFromUser,
  );
  const nodeRuntime: NodeRuntime = {
    dataDir,
    usage: {
      diskGBs: [],
      memoryBytes: [],
      cpuPercent: [],
      syncedBlock: 0,
    },
  };
  const node: Node = createNode({
    spec: nodeSpec,
    runtime: nodeRuntime,
    initialConfigFromUser,
  });
  nodeStore.addNode(node);

  setTimeout(() => {
    const runningNode = nodeStore.getNodeBySpecId(node.spec.specId);
    if (runningNode?.status === NodeStatus.running) {
      checkNodePortsAndNotify(runningNode);
    }
  }, 600000); // 10 minutes
  return node;
};

// Useful for users "ejecting" from using the UI
export const getNodeStartCommand = (nodeId: NodeId): string => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(
      `Unable to get node start command ${nodeId}. Node not found.`,
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
  node.stoppedBy = undefined;
  nodeStore.updateNode(node);

  try {
    if (isDockerNode(node)) {
      const dockerNode = node;
      // startPodmanNode(dockerNode);
      const containerIds = await startPodmanNode(dockerNode);
      dockerNode.runtime.processIds = containerIds;
      dockerNode.status = NodeStatus.running;
      if (getSetPortHasChanged(dockerNode)) {
        checkNodePortsAndNotify(dockerNode);
      }
      nodeStore.updateNode(dockerNode);
    }
  } catch (err) {
    logger.error(err);
    node.status = NodeStatus.errorStarting;
    nodeStore.updateNode(node);
  }
};

export const stopNode = async (nodeId: NodeId, stoppedBy: NodeStoppedBy) => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(`Unable to stop node ${nodeId}. Node not found.`);
  }
  logger.info(`Stopping node ${JSON.stringify(node)}`);
  node.status = NodeStatus.stopping;
  node.stoppedBy = stoppedBy;
  nodeStore.updateNode(node);

  try {
    if (isDockerNode(node)) {
      const containerIds = await stopPodmanNode(node);
      logger.info(`${containerIds} stopped`);
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

export const resetNodeConfig = (nodeId: NodeId) => {
  const existingNode = nodeStore.getNode(nodeId);

  existingNode.config.configValuesMap = existingNode.spec.execution.input
    ?.defaultConfig as ConfigValuesMap;

  nodeStore.updateNode(existingNode);
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
  options: { isDeleteStorage: boolean },
): Promise<Node> => {
  // todo: check if node can be removed. Is it stopped?
  // todo: stop & remove container
  logger.info(
    `Remove node ${nodeId} and delete storage? ${options.isDeleteStorage}`,
  );
  try {
    // Only users remove nodes
    await stopNode(nodeId, NodeStoppedBy.user);
  } catch (err) {
    logger.info(
      'Unable to stop the node before removing. Continuing with removal.',
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
    return;
  }
  const node = nodeStore.getNode(nodeId);
  if (isDockerNode(node)) {
    dockerStopSendingLogsToUI();
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
  }
};

const compareSpecsAndUpdate = (
  node: Node,
  nodeLibraryConfigTranslation: ConfigTranslationMap | undefined,
) => {
  if (node.spec.configTranslation && nodeLibraryConfigTranslation) {
    const nodeSpecKeys = Object.keys(node.spec.configTranslation);
    const nodeLibraryKeys = Object.keys(nodeLibraryConfigTranslation);

    // Compare the two sets of keys
    const areKeysDifferent =
      nodeSpecKeys.length !== nodeLibraryKeys.length ||
      nodeSpecKeys.some((key) => !nodeLibraryKeys.includes(key)) ||
      nodeLibraryKeys.some((key) => !nodeSpecKeys.includes(key));

    // If the keys are different, overwrite node.spec.configTranslation
    if (areKeysDifferent) {
      node.spec.configTranslation = nodeLibraryConfigTranslation;
    }
  }
};

/**
 * Called on app launch.
 * Check's node processes and updates internal NiceNode records.
 */
export const initialize = async () => {
  initDocker();
  initNodeLibrary();
  const nodeLibrary = getNodeLibrary();

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
            dockerNode.runtime.processIds,
          );
          // console.log(
          //   'NodeManager.initialize containerDetails: ',
          //   containerDetails,
          // );
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
            // console.log('checkNode: running', node);
          } else {
            node.status = NodeStatus.stopped;
            // console.log('checkNode: stoppeds', node);
          }
          if (containerDetails?.State?.FinishedAt) {
            node.lastStopped = containerDetails?.State?.FinishedAt;
          }
          compareSpecsAndUpdate(
            node,
            nodeLibrary[node.spec.specId].configTranslation,
          );
          nodeStore.updateNode(node);
        } catch (err) {
          // Podman is likely stopped
          // console.error(`Podman found no container for nodeId ${node.id}`);
          node.status = NodeStatus.stopped;
          nodeStore.updateNode(node);
        }
      } else {
        throw new Error(`No containerIds found for nodeId ${node.id}`);
      }
    }
  }
};

export const onExit = () => {
  onExitDocker();
};

// logger.info(
//   `process.env.NN_AUTOSTART_NODE: ${process.env.NN_AUTOSTART_NODE}`
// );
// if (getIsStartOnLogin() || process.env.NN_AUTOSTART_NODE === 'true') {
//   startGeth();
// }
