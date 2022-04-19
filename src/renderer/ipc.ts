import electron from './electronGlobal';
import { CHANNELS } from './messages';
import { updateNodeStatus } from './state/node';
import { AppDispatch } from './state/store';

export const initialize = (dispatch: AppDispatch) => {
  electron.ipcRenderer.on(CHANNELS.geth, (message) => {
    console.log('Geth status received: ', message);
    if (Array.isArray(message) && message.length === 1) {
      dispatch(updateNodeStatus(message[0]));
      return;
    }
    dispatch(updateNodeStatus(message));
    // setStatus(message);
  });
};
