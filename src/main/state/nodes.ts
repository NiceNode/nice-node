import Node, { NodeId } from '../node';
import store from './store';

const TOP_LEVEL_KEY = 'nodes';

// getNodes
export const getNodes = (): Node[] => {
  return store.get(TOP_LEVEL_KEY) || [];
};
// getNode
export const getNode = (nodeId: NodeId) => {
  const nodes = getNodes();
  return nodes.find((node) => node.id === nodeId);
};
// addNode
export const addNode = (newNode: Node) => {
  const nodes = getNodes();
  const matchingNode = nodes.find((node) => node.id === newNode.id);
  if (matchingNode) {
    // 2 nodes have matching uuids, you won the lottery
    throw new Error(`Unable to add the node. Please try again.`);
  }
  nodes.push(newNode);
  store.set(TOP_LEVEL_KEY, nodes);
  return newNode;
};
export const removeNode = (nodeId: NodeId) => {
  const nodeToRemove = getNode(nodeId);
  if (!nodeToRemove) {
    throw new Error(`Unable to remove node. ${nodeId} not found.`);
  }
  const nodes = getNodes();
  const nodesWithoutNode = nodes.filter((node) => node.id !== nodeId);
  store.set(TOP_LEVEL_KEY, nodesWithoutNode);
  return nodeToRemove;
};
