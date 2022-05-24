import store from './store';
import { NodeSpecification } from '../../common/nodeSpec';

type NodeSpecMap = Record<string, NodeSpecification>;
export type NodeLibrary = NodeSpecMap;

export const NODE_LIBRARY_KEY = 'nodeLibrary';
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
  let nodes = store.get(NODE_LIBRARY_KEY);
  if (!nodes || typeof nodes !== 'object') {
    nodes = {};
    store.set(NODE_LIBRARY_KEY, {});
  }
};
initialize();

export const getNodeLibrary = (): NodeLibrary => {
  const nodes: NodeLibrary = store.get(NODE_LIBRARY_KEY);
  return nodes;
};

export const updateNodeLibrary = (nodes: NodeLibrary): NodeLibrary => {
  store.set(NODE_LIBRARY_KEY, nodes);
  return getNodeLibrary();
};

// export const getNode = (nodeId: NodeId): Node => {
//   return store.get(`${USER_NODES_KEY}.${NODES_KEY}.${nodeId}`);
// };

// export const getNodeBySpecId = (specId: string): Node | undefined => {
//   return getNodes().find((node: Node) => node && node?.spec?.specId === specId);
// };
