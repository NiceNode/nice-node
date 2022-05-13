import { NodeSpecification } from '../common/nodeSpec';
import {
  getContainerDetails,
  removeDockerNode,
  startDockerNode,
  stopDockerNode,
} from './docker';
import logger from './logger';
import Node, {
  createNode,
  isDockerNode,
  NodeId,
  NodeRuntime,
  NodeStatus,
} from '../common/node';
import * as nodeStore from './state/nodes';
import { makeNodeDir } from './files';
import { startBinary } from './binary';

export const addNode = async (nodeSpec: NodeSpecification): Promise<Node> => {
  const dataDir = await makeNodeDir(nodeSpec.specId);
  const nodeRuntime: NodeRuntime = {
    dataDir,
    usage: {},
  };
  const node: Node = createNode({ spec: nodeSpec, runtime: nodeRuntime });
  nodeStore.addNode(node);
  return node;
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
      // startDockerNode(dockerNode);
      const containerIds = await startDockerNode(dockerNode);
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

  if (isDockerNode(node)) {
    const containerIds = await stopDockerNode(node);
    logger.info(`${containerIds} stopped`);
    node.status = NodeStatus.stopped;
    nodeStore.updateNode(node);
  }
};

export const removeNode = async (nodeId: NodeId): Promise<Node> => {
  // todo: check if node can be removed. Is it stopped?
  // todo: stop & remove container
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
    const isDockerRemoved = await removeDockerNode(node);
    logger.info(`isDockerRemoved ${isDockerRemoved}`);
  }
  // todo: delete data
  const removedNode = nodeStore.removeNode(nodeId);
  return removedNode;
};

/**
 * Called on app launch.
 * Check's node processes and updates internal NiceNode records.
 */
export const initialize = async () => {
  // get all nodes
  const nodes = nodeStore.getNodes();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isDockerNode(node)) {
      const dockerNode = node;
      if (Array.isArray(dockerNode?.runtime?.processIds)) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const containerDetails = await getContainerDetails(
            dockerNode.runtime.processIds
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
    }
  }
};
