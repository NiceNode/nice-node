import Node, { NodeId, NodeOptions } from './node';
import * as nodeStore from './state/nodes';

export const addNode = (nodeOptions: NodeOptions) => {
  const node = new Node(nodeOptions);
  nodeStore.addNode(node);
  return node;
};

export const startNode = (nodeId: NodeId) => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(`Unable to start node ${nodeId}. Node not found.`);
  }
  return node.start();
};

export const stopNode = (nodeId: NodeId) => {
  const node = nodeStore.getNode(nodeId);
  if (!node) {
    throw new Error(`Unable to stop node ${nodeId}. Node not found.`);
  }
  return node.stop();
};
