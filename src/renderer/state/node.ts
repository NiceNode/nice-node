import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import Node, {
  NodeId,
  NodePackage,
  NodeStatus,
  UserNodePackages,
  UserNodes,
} from '../../common/node';

// Define a type for the slice state
export interface NodeState {
  userNodes?: UserNodes;
  userNodePackages?: UserNodePackages;
  selectedNodePackageId?: NodeId;
  selectedNodePackage?: NodePackage;
  selectedNodeId?: NodeId;
  selectedNode?: Node;
  numGethDiskUsedGB: number | undefined;
  numFreeDiskGB: number | undefined;
  status: string | undefined;
  // True, if the node is running and has HTTP RPC enabled (TODO HTTP)
  isAvailableForPolling: boolean | undefined;
}

// Define the initial state using that type
export const initialState: NodeState = {
  userNodes: undefined,
  userNodePackages: undefined,
  selectedNodePackageId: undefined,
  selectedNodePackage: undefined,
  selectedNodeId: undefined,
  selectedNode: undefined,
  numGethDiskUsedGB: undefined,
  numFreeDiskGB: undefined,
  status: 'loading',
  isAvailableForPolling: undefined,
};

console.log('Intial node state: ', initialState);
/**
 * If the node is running and has http turned on, then poll!
 * @param state NodeState
 */
const setIsAvailableForPolling = (state: NodeState) => {
  // todo: add http check
  if (state.userNodes && state.selectedNodeId && state.userNodes.nodes) {
    const node = state.userNodes.nodes[state.selectedNodeId];
    if (node && node.status === NodeStatus.running) {
      console.log('Starting polling node for data');
      state.isAvailableForPolling = true;
      return;
    }
  }
  console.log('Stop polling node for data');
  state.isAvailableForPolling = false;
};

const setSelectedNode = (state: NodeState) => {
  const { selectedNodeId, userNodes } = state;
  if (selectedNodeId && userNodes && userNodes.nodes[selectedNodeId]) {
    state.selectedNode = userNodes.nodes[selectedNodeId];
  } else {
    state.selectedNode = undefined;
  }
};

const setSelectedNodePackage = (state: NodeState) => {
  const { selectedNodePackageId, userNodePackages } = state;
  if (
    selectedNodePackageId &&
    userNodePackages &&
    userNodePackages.nodes[selectedNodePackageId]
  ) {
    state.selectedNodePackage = userNodePackages.nodes[selectedNodePackageId];
  } else {
    state.selectedNodePackage = undefined;
  }
};

export const nodeSlice = createSlice({
  name: 'node',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateUserNodePackages: (
      state,
      action: PayloadAction<UserNodePackages | undefined>,
    ) => {
      state.userNodePackages = action.payload;
      setSelectedNodePackage(state);
      setIsAvailableForPolling(state);
    },
    updateSelectedNodePackageId: (
      state,
      action: PayloadAction<NodeId | undefined>,
    ) => {
      console.log('State update updateSelectedNodePackageId: ', state, action);
      state.selectedNodePackageId = action.payload;
      setSelectedNodePackage(state);
      setIsAvailableForPolling(state);
    },
    updateUserNodes: (state, action: PayloadAction<UserNodes | undefined>) => {
      state.userNodes = action.payload;
      setSelectedNode(state);
      setIsAvailableForPolling(state);
    },
    updateSelectedNodeId: (
      state,
      action: PayloadAction<NodeId | undefined>,
    ) => {
      state.selectedNodeId = action.payload;
      setSelectedNode(state);
      setIsAvailableForPolling(state);
    },
    updateNodeNumGethDiskUsedGB: (
      state,
      action: PayloadAction<number | undefined>,
    ) => {
      state.numGethDiskUsedGB = action.payload;
    },
    updateSystemNumFreeDiskGB: (
      state,
      action: PayloadAction<number | undefined>,
    ) => {
      state.numFreeDiskGB = action.payload;
    },
  },
});

export const {
  updateUserNodePackages,
  updateSelectedNodePackageId,
  updateUserNodes,
  updateSelectedNodeId,
  updateNodeNumGethDiskUsedGB,
  updateSystemNumFreeDiskGB,
} = nodeSlice.actions;

export const selectUserNodePackages = (
  state: RootState,
): UserNodePackages | undefined => state.node.userNodePackages;
export const selectSelectedNodePackageId = (
  state: RootState,
): NodeId | undefined => state.node.selectedNodePackageId;
export const selectSelectedNodePackage = (
  state: RootState,
): NodePackage | undefined => state.node.selectedNodePackage;
export const selectUserNodes = (state: RootState): UserNodes | undefined =>
  state.node.userNodes;
export const selectSelectedNodeId = (state: RootState): NodeId | undefined =>
  state.node.selectedNodeId;
export const selectSelectedNode = (state: RootState): Node | undefined =>
  state.node.selectedNode;
export const selectNumGethDiskUsedGB = (state: RootState): number | undefined =>
  state.node.numGethDiskUsedGB;
export const selectNumFreeDiskGB = (state: RootState): number | undefined =>
  state.node.numFreeDiskGB;
export const selectNodeStatus = (state: RootState): string | undefined =>
  state.node.status;
export const selectIsAvailableForPolling = (
  state: RootState,
): boolean | undefined => state.node.isAvailableForPolling;

export default nodeSlice.reducer;
