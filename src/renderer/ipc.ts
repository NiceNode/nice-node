import { UserNodePackages, UserNodes } from '../common/node';
import electron from './electronGlobal';
import { updateUserNodePackages, updateUserNodes } from './state/node';

// eslint-disable-next-line
export const initialize = async (dispatch: any) => {
  const initUserNodes = await electron.getUserNodes();
  console.log('Fetching initial userNodes');
  dispatch(updateUserNodes(initUserNodes));
  console.log('Listening to IPC channel userNodes');
  electron.ipcRenderer.on('userNodes', (message: UserNodes[]) => {
    const userNodes: UserNodes = message[0];
    dispatch(updateUserNodes(userNodes));
    // qGetNodes.refetch();
  });

  const initUserNodePackages = await electron.getUserNodePackages();
  console.log('Fetching initial userNodePackages');
  dispatch(updateUserNodePackages(initUserNodePackages));
  console.log('Listening to IPC channel userNodePackages');
  electron.ipcRenderer.on('userNodePackages', (message: UserNodePackages[]) => {
    const userNodePackages: UserNodePackages = message[0];
    dispatch(updateUserNodePackages(userNodePackages));
    // qGetNodes.refetch();
  });
};
