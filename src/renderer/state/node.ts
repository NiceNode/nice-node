import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { NodeConfig } from '../../main/state/nodeConfig';
import Node, { NodeId, NodeStatus, UserNodes } from '../../common/node';

// Define a type for the slice state
export interface NodeState {
  userNodes?: UserNodes;
  selectedNodeId?: NodeId;
  config?: NodeConfig;
  numGethDiskUsedGB: number | undefined;
  numFreeDiskGB: number | undefined;
  status: string | undefined;
  // True, if the node is running and has HTTP RPC enabled (TODO HTTP)
  isAvailableForPolling: boolean | undefined;
}

// Define the initial state using that type
export const initialState: NodeState = {
  userNodes: undefined,
  selectedNodeId: undefined,
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

export const nodeSlice = createSlice({
  name: 'node',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateUserNodes: (state, action: PayloadAction<UserNodes | undefined>) => {
      state.userNodes = action.payload;
      setIsAvailableForPolling(state);
    },
    updateSelectedNodeId: (
      state,
      action: PayloadAction<NodeId | undefined>
    ) => {
      state.selectedNodeId = action.payload;
      setIsAvailableForPolling(state);
    },
    updateNodeNumGethDiskUsedGB: (
      state,
      action: PayloadAction<number | undefined>
    ) => {
      state.numGethDiskUsedGB = action.payload;
    },
    updateSystemNumFreeDiskGB: (
      state,
      action: PayloadAction<number | undefined>
    ) => {
      state.numFreeDiskGB = action.payload;
    },
    // updateNodeStatus: (state, action: PayloadAction<string | undefined>) => {
    //   state.status = action.payload;
    //   setIsAvailableForPolling(state);
    // },
    // updateNodeConfig: (
    //   state,
    //   action: PayloadAction<NodeConfig | undefined>
    // ) => {
    //   state.config = action.payload;
    //   setIsAvailableForPolling(state);
    // },
  },
});

export const {
  updateUserNodes,
  updateSelectedNodeId,
  updateNodeNumGethDiskUsedGB,
  updateSystemNumFreeDiskGB,
} = nodeSlice.actions;

export const selectUserNodes = (state: RootState): UserNodes | undefined =>
  state.node.userNodes;
export const selectSelectedNodeId = (state: RootState): NodeId | undefined =>
  state.node.selectedNodeId;
export const selectNodeConfig = (state: RootState) => state.node.config;
export const selectNumGethDiskUsedGB = (state: RootState): number | undefined =>
  state.node.numGethDiskUsedGB;
export const selectNumFreeDiskGB = (state: RootState): number | undefined =>
  state.node.numFreeDiskGB;
export const selectNodeStatus = (state: RootState): string | undefined =>
  state.node.status;
export const selectIsAvailableForPolling = (
  state: RootState
): boolean | undefined => state.node.isAvailableForPolling;

export default nodeSlice.reducer;
