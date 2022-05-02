import Node, { NodeId } from '../node';
import store from './store';

const USER_NODES_KEY = 'userNodes';
const NODES_KEY = 'nodes';
const NODE_IDS_KEY = 'nodeIds';
/**
 * This format allows for both hash lookup (nodes) and
 * convenient retrevial of all IDs with ordering (nodeIds).
 * nodes = {
 *  nodeId: {
 *    ...node
 *  },
 * }
 * nodeIds = [id2, id3, id1] // stored in display order
 */
type NodeMap = Record<string, Node>;
type UserNodes = {
  nodes: NodeMap;
  nodeIds: string[];
};
const initialize = () => {
  const userNodes = store.get(USER_NODES_KEY);
  if (!userNodes || typeof userNodes !== 'object') {
    store.set(USER_NODES_KEY, {});
  }
  if (!userNodes.nodes || typeof userNodes.nodes !== 'object') {
    store.set(`${USER_NODES_KEY}.${NODES_KEY}`, {});
  }
  if (!Array.isArray(userNodes.nodeIds)) {
    store.set(`${USER_NODES_KEY}.${NODE_IDS_KEY}`, []);
  }
};
initialize();

export const getUserNodes = (): UserNodes => {
  const userNodes: UserNodes = store.get(USER_NODES_KEY);
  return userNodes;
};

export const getNodes = (): Node[] => {
  const userNodes: UserNodes = store.get(USER_NODES_KEY);
  const nodes = userNodes.nodeIds.map((nodeId) => userNodes.nodes[nodeId]);
  return nodes;
};

export const getNode = (nodeId: NodeId) => {
  return store.get(`${USER_NODES_KEY}.${NODES_KEY}.${nodeId}`);
};

export const addNode = (newNode: Node) => {
  const userNodes = getUserNodes();
  const { nodes, nodeIds } = userNodes;
  if (nodes[newNode.id]) {
    // 2 nodes have matching uuids, you won the lottery
    throw new Error(`Unable to add the node. Please try again.`);
  }
  nodes[newNode.id] = newNode;
  nodeIds.push(newNode.id);
  store.set(USER_NODES_KEY, { nodes, nodeIds });
  return newNode;
};

// todo: put a lock on anything that changes nodes array
//  or process events in a queue?
export const updateNode = (node: Node) => {
  store.set(`${USER_NODES_KEY}.${NODES_KEY}.${node.id}`, node);
  return getNode(node.id);
};

// todo: an optimization
// export const updateNodeProperty = (
//   nodeId: NodeId,
//   property: string,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   value: any
// ) => {
//   store.set(`${USER_NODES_KEY}.${NODES_KEY}.${nodeId}.${property}`, value);
//   return getNode(nodeId);
// };

export const removeNode = (nodeId: NodeId) => {
  // todo: check if node can be removed. Is it stopped?
  const userNodes = getUserNodes();
  const { nodes, nodeIds } = userNodes;
  const nodeToRemove = nodes[nodeId];
  if (!nodeToRemove) {
    throw new Error(`Unable to remove node. ${nodeId} not found.`);
  }
  delete nodes[nodeId];
  const newNodeIds = nodeIds.filter((id) => id !== nodeId); // will return ['A', 'C']
  store.set(USER_NODES_KEY, { nodes, nodeIds: newNodeIds });
  return nodeToRemove;
};
