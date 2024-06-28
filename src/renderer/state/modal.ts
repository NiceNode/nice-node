import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { RootState } from './store';

export interface ModalScreen {
  route: string | undefined;
  type: 'alert' | 'modal' | 'info' | undefined;
  data?: Record<string, unknown>;
}

// Define a type for the slice state
export interface ModalState {
  isModalOpen: boolean;
  screen: ModalScreen;
}

// Define the initial state using that type
export const initialState: ModalState = {
  isModalOpen: false,
  screen: {
    route: undefined,
    type: undefined,
  },
};

console.log('Intial modal state: ', initialState);

export const modalSlice = createSlice({
  name: 'modal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setModalState: (state, action: PayloadAction<ModalState>) => {
      const { isModalOpen, screen } = action.payload;
      state.isModalOpen = isModalOpen;
      state.screen = screen;
    },
  },
});

export const { setModalState } = modalSlice.actions;

export const getModalState = (state: RootState): ModalState => state.modal;

export default modalSlice.reducer;
