import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface ModalScreen {
  route: string | undefined;
  type: 'alert' | 'modal' | undefined;
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
      state.isModalOpen = action.payload.isModalOpen;
      state.screen = action.payload.screen;
    },
  },
});

export const { setModalState } = modalSlice.actions;

export const getIsModalOpen = (state: RootState): boolean | undefined =>
  state.modal.isModalOpen;

export const getModalScreen = (state: RootState): ModalScreen =>
  state.modal.screen;

export const getModalState = (state: RootState): ModalState => state.modal;

export default modalSlice.reducer;
