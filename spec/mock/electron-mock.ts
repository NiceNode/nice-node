import createIPCMock from 'electron-mock-ipc';

const mocked = createIPCMock();
const { ipcMain, ipcRenderer } = mocked;
const electron = { ipcMain, ipcRenderer };
export default electron;
