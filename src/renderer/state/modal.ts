import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface ModalScreen {
  route: string | undefined;
  type: 'alert' | 'modal' | undefined;
}

export interface ModalConfig {
  preferences: object;
  addNodes: object;
  nodeSettings: object;
}

// Define a type for the slice state
export interface ModalState {
  isModalOpen: boolean;
  screen: ModalScreen;
  config: ModalConfig;
}

// Define the initial state using that type
export const initialState: ModalState = {
  isModalOpen: false,
  screen: {
    route: undefined,
    type: undefined,
  },
  config: {
    preferences: {},
    addNodes: {},
    nodeSettings: {},
  },
};

console.log('Intial modal state: ', initialState);

export const modalSlice = createSlice({
  name: 'modal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setModalState: (state, action: PayloadAction<ModalState>) => {
      const { isModalOpen, screen, config } = action.payload;
      state.isModalOpen = isModalOpen;
      state.screen = screen;
      if (Object.keys(config).length === 0 && config.constructor === Object) {
        state.config = initialState.config;
      }
    },
    setModalConfig: (state, action: PayloadAction<ModalConfig>) => {
      const configKey = Object.keys(action.payload)[0];
      state.config[configKey as keyof ModalConfig] =
        action.payload[configKey as keyof ModalConfig];
    },
  },
});

export const { setModalState, setModalConfig } = modalSlice.actions;

export const getModalState = (state: RootState): ModalState => state.modal;

export default modalSlice.reducer;
