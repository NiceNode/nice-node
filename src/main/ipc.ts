import { ipcMain } from 'electron';
import getDebugInfo from './debug';
import {
  getGethLogs,
  getGethErrorLogs,
  getGethUsedDiskSpace,
  getSystemFreeDiskSpace,
  deleteGethDisk,
} from './files';
import {
  getDefaultNodeConfig,
  setToDefaultNodeConfig,
  getNodeConfig,
  getStatus,
  startGeth,
  stopGeth,
} from './geth';
import { store } from './store';
import logger from './logger';
import {
  checkSystemHardware,
  getMainProcessUsage,
  getNodeUsage,
} from './monitor';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  ipcMain.handle('getGethStatus', getStatus);
  ipcMain.handle('startGeth', startGeth);
  ipcMain.handle('stopGeth', stopGeth);
  ipcMain.handle('deleteGethDisk', deleteGethDisk);
  ipcMain.handle('getGethDiskUsed', getGethUsedDiskSpace);
  ipcMain.handle('getSystemFreeDiskSpace', getSystemFreeDiskSpace);
  ipcMain.handle('getDebugInfo', getDebugInfo);
  ipcMain.handle('getStoreValue', (_event, key: string) => {
    const value = store.get(key);
    logger.info(`store.get(key, value): ${key},${value}`);
    return value;
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcMain.handle('setStoreValue', (_event, key: string, value: any) => {
    logger.info(`store.set(key, value): ${key},${value}`);
    return store.set(key, value);
  });
  ipcMain.handle('getGethLogs', getGethLogs);
  ipcMain.handle('getGethErrorLogs', getGethErrorLogs);
  ipcMain.handle('getNodeConfig', getNodeConfig);
  ipcMain.handle('getDefaultNodeConfig', getDefaultNodeConfig);
  ipcMain.handle('setToDefaultNodeConfig', setToDefaultNodeConfig);
  ipcMain.handle('getNodeUsage', getNodeUsage);
  ipcMain.handle('getMainProcessUsage', getMainProcessUsage);
  ipcMain.handle('checkSystemHardware', checkSystemHardware);
};
