// eslint-disable-next-line import/no-cycle
import { send } from '../messenger';
import Node, { DockerNode, isDockerNode, NodeId, NodeStatus } from '../node';
import store from './store';

export const USER_NODES_KEY = 'userNodes';
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

/**
 * Called on app launch.
 * Initializes internal data structures for readiness.
 */
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

  // Notify the UI when values change
  store.onDidChange(USER_NODES_KEY, (newValue: UserNodes) => {
    send('userNodes', newValue);
  });
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
  store.set(`${USER_NODES_KEY}.${NODES_KEY}.${node.id}`, { ...node });
  return getNode(node.id);
};

/**
 * Finds a node by a docker container Id and updates the status
 * @param containerId
 * @param status
 * @returns
 */
export const setDockerNodeStatus = (
  containerId: string,
  status: NodeStatus
) => {
  // get all nodes
  const nodes = getNodes();
  const nodeToUpdate = nodes.find((node) => {
    if (isDockerNode(node)) {
      const dockerNode = node as DockerNode;
      return dockerNode.containerIds?.includes(containerId);
    }
    return false;
  });
  if (!nodeToUpdate) {
    throw new Error(`No node found with containerId ${containerId}`);
  }
  // search all contianerIds for matching one
  store.set(`${USER_NODES_KEY}.${NODES_KEY}.${nodeToUpdate.id}.status`, status);
  return getNode(nodeToUpdate.id);
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
