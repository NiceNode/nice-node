import createIPCMock from 'electron-mock-ipc';
import * as customPreloads from './custom-preload-mock';

const mocked = createIPCMock();
const { ipcMain, ipcRenderer } = mocked;
const electron = { ipcMain, ipcRenderer, ...customPreloads };
export default electron;
