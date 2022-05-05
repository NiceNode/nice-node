import electron from './electronGlobal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initialize = (qGetNodes: any) => {
  console.log('Listening to IPC channel userNodes');
  electron.ipcRenderer.on('userNodes', (message) => {
    console.log(`IPC::userNodes:: message received: `, message);
    qGetNodes.refetch();
  });
};
