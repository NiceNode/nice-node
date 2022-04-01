import { ipcMain } from 'electron';
import getDebugInfo from './debug';
import { getGethUsedDiskSpace, getSystemFreeDiskSpace } from './files';
import { getStatus, startGeth, stopGeth } from './geth';
import { store } from './store';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  ipcMain.handle('getGethStatus', getStatus);
  ipcMain.handle('startGeth', startGeth);
  ipcMain.handle('stopGeth', stopGeth);
  ipcMain.handle('getGethDiskUsed', getGethUsedDiskSpace);
  ipcMain.handle('getSystemFreeDiskSpace', getSystemFreeDiskSpace);
  ipcMain.handle('getDebugInfo', getDebugInfo);
  ipcMain.handle('getStoreValue', (_event, key: string) => {
    const value = store.get(key);
    console.log('store.get(key, value)', key, value);
    return value;
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle('setStoreValue', (_event, key: string, value: any) => {
    console.log('store.set(key, value)', key, value);
    return store.set(key, value);
  });
};
