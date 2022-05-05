import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { NodeConfig } from '../../main/state/nodeConfig';
import { NodeId, NodeStatus } from '../../main/node';

// Define a type for the slice state
export interface NodeState {
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
  if (state.status === NodeStatus.running && state?.config?.http === true) {
    state.isAvailableForPolling = true;
    console.log('Starting polling node for data');
  } else {
    state.isAvailableForPolling = false;
    console.log('Stop polling node for data');
  }
};

export const nodeSlice = createSlice({
  name: 'node',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateSelectedNodeId: (
      state,
      action: PayloadAction<NodeId | undefined>
    ) => {
      state.selectedNodeId = action.payload;
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
    updateNodeStatus: (state, action: PayloadAction<string | undefined>) => {
      state.status = action.payload;
      setIsAvailableForPolling(state);
    },
    updateNodeConfig: (
      state,
      action: PayloadAction<NodeConfig | undefined>
    ) => {
      state.config = action.payload;
      setIsAvailableForPolling(state);
    },
  },
});

export const {
  updateSelectedNodeId,
  updateNodeConfig,
  updateNodeNumGethDiskUsedGB,
  updateSystemNumFreeDiskGB,
  updateNodeStatus,
} = nodeSlice.actions;

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
