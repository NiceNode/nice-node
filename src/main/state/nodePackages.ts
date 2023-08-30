import { CHANNELS, send } from '../messenger';
import Node, {
  isDockerNode,
  NodeId,
  NodePackage,
  NodeStatus,
  UserNodePackages,
} from '../../common/node';
import store from './store';
import { ConfigValuesMap } from '../../common/nodeConfig';

export const USER_NODE_PACKAGES_KEY = 'userNodePackages';
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

/**
 * Called on app launch.
 * Initializes internal data structures for readiness.
 */
const initialize = () => {
  let userNodePackages = store.get(USER_NODE_PACKAGES_KEY);
  if (!userNodePackages || typeof userNodePackages !== 'object') {
    userNodePackages = {};
    store.set(USER_NODE_PACKAGES_KEY, {});
  }
  if (!userNodePackages.nodes || typeof userNodePackages.nodes !== 'object') {
    store.set(`${USER_NODE_PACKAGES_KEY}.${NODES_KEY}`, {});
  }
  if (!Array.isArray(userNodePackages.nodeIds)) {
    store.set(`${USER_NODE_PACKAGES_KEY}.${NODE_IDS_KEY}`, []);
  }

  // Notify the UI when values change
  store.onDidChange(USER_NODE_PACKAGES_KEY, (newValue: UserNodePackages) => {
    send(CHANNELS.userNodePackages, newValue);
  });
};
initialize();

export const getUserNodePackages = (): UserNodePackages => {
  const userNodePackages: UserNodePackages = store.get(USER_NODE_PACKAGES_KEY);
  return userNodePackages;
};

export const getNodePackages = (): Node[] => {
  const userNodePackages: UserNodePackages = store.get(USER_NODE_PACKAGES_KEY);
  const nodes = userNodePackages.nodeIds.map(
    (nodeId) => userNodePackages.nodes[nodeId],
  );
  return nodes;
};

export const getNodePackage = (nodeId: NodeId): Node => {
  return store.get(`${USER_NODE_PACKAGES_KEY}.${NODES_KEY}.${nodeId}`);
};

export const getNodePackageBySpecId = (specId: string): Node | undefined => {
  return getNodePackages().find(
    (node: Node) => node && node?.spec?.specId === specId,
  );
};

export const addNodePackage = (newNode: NodePackage) => {
  const userNodePackages = getUserNodePackages();
  const { nodes, nodeIds } = userNodePackages;
  if (nodes[newNode.id]) {
    // 2 nodes have matching uuids, you won the lottery
    throw new Error(`Unable to add the node. Please try again.`);
  }
  nodes[newNode.id] = newNode;
  nodeIds.push(newNode.id);
  store.set(USER_NODE_PACKAGES_KEY, { nodes, nodeIds });
  return newNode;
};

export const updateNodeProperties = (
  nodeId: NodeId,
  propertiesToUpdate: any,
) => {
  console.log('updateNodeProperties: propertiesToUpdate', propertiesToUpdate);
  const node = getNodePackage(nodeId);
  const newNode = {
    ...node,
    ...propertiesToUpdate,
  };
  console.log(
    'updateNodeProperties: newNode propertiesToUpdate',
    newNode,
    propertiesToUpdate,
  );
  store.set(`${USER_NODE_PACKAGES_KEY}.${NODES_KEY}.${node.id}`, newNode);
  return getNodePackage(node.id);
};

/**
 * Update node config values passed (doesn't change values if not passed)
 * @param nodeId
 * @param newConfig
 * @returns updated Node
 */
export const updateNodeConfig = (
  nodeId: NodeId,
  newConfig: ConfigValuesMap,
) => {
  console.log('updateNodeProperties: propertiesToUpdate', newConfig);
  // todo: could add some validation on the config key and values with the
  //  those detailed in the node spec
  return updateNodeProperties(nodeId, { config: newConfig });
};

// todo: put a lock on anything that changes nodes array
//  or process events in a queue?
export const updateNodePackage = (node: NodePackage) => {
  store.set(`${USER_NODE_PACKAGES_KEY}.${NODES_KEY}.${node.id}`, { ...node });
  return getNodePackage(node.id);
};

// todo: needed?
/**
 * Finds a node by a docker container Id and updates the status
 * @param containerId
 * @param status
 * @returns
 */
export const setDockerNodeStatus = (
  containerId: string,
  status: NodeStatus,
) => {
  // get all nodes
  const nodes = getNodePackages();
  const nodeToUpdate = nodes.find((node) => {
    if (isDockerNode(node)) {
      const dockerNode = node;
      return dockerNode.runtime?.processIds?.includes(containerId);
    }
    return false;
  });
  if (!nodeToUpdate) {
    // If it is a start event, this may not be an error.
    throw new Error(`No node found with containerId ${containerId}`);
  }
  // search all contianerIds for matching one
  store.set(
    `${USER_NODE_PACKAGES_KEY}.${NODES_KEY}.${nodeToUpdate.id}.status`,
    status,
  );
  return getNodePackage(nodeToUpdate.id);
};

// todo: remove node services
export const removeNodePackage = (nodeId: NodeId) => {
  // todo: check if node can be removed. Is it stopped?
  // todo: stop & remove container
  const userNodePackages = getUserNodePackages();
  const { nodes, nodeIds } = userNodePackages;
  const nodeToRemove = nodes[nodeId];
  if (!nodeToRemove) {
    throw new Error(`Unable to remove node. ${nodeId} not found.`);
  }
  delete nodes[nodeId];
  const newNodeIds = nodeIds.filter((id) => id !== nodeId); // will return ['A', 'C']
  store.set(USER_NODE_PACKAGES_KEY, { nodes, nodeIds: newNodeIds });
  return nodeToRemove;
};
