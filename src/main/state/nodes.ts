import { CHANNELS, send } from '../messenger';
import { powerMonitor } from 'electron';
import { didPortsChange } from '../ports';
import Node, {
  isDockerNode,
  NodeId,
  NodeStatus,
  NodeStoppedBy,
  UserNodes,
} from '../../common/node';
import store from './store';
import { ConfigValuesMap } from '../../common/nodeConfig';

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

/**
 * Called on app launch.
 * Initializes internal data structures for readiness.
 */
const initialize = () => {
  let userNodes = store.get(USER_NODES_KEY);
  if (!userNodes || typeof userNodes !== 'object') {
    userNodes = {};
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
    send(CHANNELS.userNodes, newValue);
  });
};
initialize();

export const clear = () => {
  store.set(USER_NODES_KEY, { [NODES_KEY]: {}, [NODE_IDS_KEY]: [] });
};

export const getUserNodes = (): UserNodes => {
  const userNodes: UserNodes = store.get(USER_NODES_KEY);
  return userNodes;
};

export const getNodes = (): Node[] => {
  const userNodes: UserNodes = store.get(USER_NODES_KEY);
  const nodes = userNodes.nodeIds.map((nodeId) => userNodes.nodes[nodeId]);
  return nodes;
};

export const getNode = (nodeId: NodeId): Node => {
  return store.get(`${USER_NODES_KEY}.${NODES_KEY}.${nodeId}`);
};

export const getNodeBySpecId = (specId: string): Node | undefined => {
  return getNodes().find((node: Node) => node && node?.spec?.specId === specId);
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

export const getSetPortHasChanged = (
  node: Node,
  portHasChanged?: boolean | undefined,
) => {
  if (portHasChanged !== undefined) {
    store.set(
      `${USER_NODES_KEY}.${NODES_KEY}.${node.id}.portHasChanged`,
      portHasChanged,
    );
  }
  const portHasChangedValue: boolean = store.get(
    `${USER_NODES_KEY}.${NODES_KEY}.${node.id}.portHasChanged`,
  );
  return portHasChangedValue;
};

export const updateNodeProperties = (
  nodeId: NodeId,
  propertiesToUpdate: any,
) => {
  console.log('updateNodeProperties: propertiesToUpdate', propertiesToUpdate);
  const node = getNode(nodeId);
  const newNode = {
    ...node,
    ...propertiesToUpdate,
  };
  console.log(
    'updateNodeProperties: newNode propertiesToUpdate',
    newNode,
    propertiesToUpdate,
  );
  store.set(`${USER_NODES_KEY}.${NODES_KEY}.${node.id}`, newNode);
  if (didPortsChange(propertiesToUpdate.config, node)) {
    getSetPortHasChanged(newNode, true);
  }
  return getNode(node.id);
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
  status: NodeStatus,
) => {
  // get all nodes
  const nodes = getNodes();
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
  store.set(`${USER_NODES_KEY}.${NODES_KEY}.${nodeToUpdate.id}.status`, status);
  return getNode(nodeToUpdate.id);
};

// todo: an optimization
// export const updateNodeProperty = (
//   nodeId: NodeId,
//   property: string,
//   // eslint-disable-next-line
//   value: any
// ) => {
//   store.set(`${USER_NODES_KEY}.${NODES_KEY}.${nodeId}.${property}`, value);
//   return getNode(nodeId);
// };

export const removeNode = (nodeId: NodeId) => {
  // todo: check if node can be removed. Is it stopped?
  // todo: stop & remove container
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

powerMonitor.on('shutdown', () => {
  restartNodes('shutdown');
});

powerMonitor.on('suspend', () => {
  restartNodes('shutdown');
});

powerMonitor.on('resume', () => {
  restartNodes('login');
});

const restartNodes = (reason: 'shutdown' | 'login') => {
  const nodesToRestart = getNodes().filter(
    (node) =>
      node.status === NodeStatus.running &&
      node.stoppedBy !== NodeStoppedBy.user,
  );
  nodesToRestart.forEach((node) => {
    node.status = NodeStatus.starting;
    node.stoppedBy =
      reason === NodeStoppedBy.shutdown
        ? NodeStoppedBy.shutdown
        : NodeStoppedBy.niceNode;
    updateNode(node);
  });
};
