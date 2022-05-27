import { UserNodes } from '../common/node';
import electron from './electronGlobal';
import { updateUserNodes } from './state/node';
import { updateNodeLogs } from './state/node';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initialize = async (dispatch: any) => {
  const initUserNodes = await electron.getUserNodes();
  console.log('Fetching initial userNodes');
  dispatch(updateUserNodes(initUserNodes));
  console.log('Listening to IPC channel userNodes');
  electron.ipcRenderer.on('userNodes', (message: any) => {
    console.log(`IPC::userNodes:: message received: `, message);
    const userNodes: UserNodes = message[0];
    dispatch(updateUserNodes(userNodes));
    // qGetNodes.refetch();
  });
};
