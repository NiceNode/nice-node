import { startDockerNode, stopDockerNode } from './docker';
import logger from './logger';
import Node, { createNode, DockerNode, NodeId, NodeOptions } from './node';
import * as nodeStore from './state/nodes';

export const addNode = (nodeOptions: NodeOptions) => {
  const node: Node = createNode(nodeOptions);
  nodeStore.addNode(node);
  return node;
};

export const startNode = async (nodeId: NodeId) => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(`Unable to start node ${nodeId}. Node not found.`);
  }
  logger.info(`Starting node ${JSON.stringify(node)}`);
  // start
  //  docker run
  if (node.executionType === 'docker') {
    const dockerNode = node as DockerNode;
    const containerIds = await startDockerNode(dockerNode);
    dockerNode.containerIds = containerIds;
    nodeStore.updateNode(dockerNode);
  } else {
    logger.info('TODO: start a binary');
  }
};

export const stopNode = async (nodeId: NodeId) => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(`Unable to stop node ${nodeId}. Node not found.`);
  }
  logger.info(`Stopping node ${JSON.stringify(node)}`);
  // start
  //  docker run
  if (node.executionType === 'docker') {
    const containerIds = await stopDockerNode(node as DockerNode);
    logger.info(`${containerIds} stopped`);
  }
  // stop
  //  docker stop
};
