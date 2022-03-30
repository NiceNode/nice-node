import createIPCMock from 'electron-mock-ipc';

const mocked = createIPCMock();
const { ipcMain, ipcRenderer } = mocked;
export { ipcMain, ipcRenderer };
