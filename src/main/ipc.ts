/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain } from 'electron';
import getDebugInfo from './debug';
import {
  getGethLogs,
  getGethErrorLogs,
  getSystemFreeDiskSpace,
  getNodesDirPathDetails,
} from './files';
import store from './state/store';
import logger from './logger';
import {
  checkSystemHardware,
  getMainProcessUsage,
  updateNodeUsedDiskSpace,
} from './monitor';
import {
  addNode,
  startNode,
  stopNode,
  removeNode,
  deleteNodeStorage,
  sendNodeLogs,
  stopSendingNodeLogs,
  getNodeStartCommand,
} from './nodeManager';
import { getNodes, getUserNodes, updateNodeProperties } from './state/nodes';
import Node, { NodeId } from '../common/node';
import { NodeSpecification } from '../common/nodeSpec';
import { isDockerInstalled, isDockerRunning } from './docker/docker';
import installDocker from './docker/install';
// eslint-disable-next-line import/no-cycle
import {
  openDialogForNodeDataDir,
  openDialogForStorageLocation,
  updateNodeDataDir,
} from './dialog';
import { getNodeLibrary } from './state/nodeLibrary';
import {
  getSetHasSeenSplashscreen,
  getSettings,
  setIsOpenOnStartup,
  setLanguage,
  setThemeSetting,
  ThemeSetting,
} from './state/settings';
import { getSystemInfo } from './systemInfo';
import startDocker from './docker/start';
import { addEthereumNode } from './specialNodes/ethereumNode';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  ipcMain.handle('updateNodeUsedDiskSpace', (_event, nodeId: NodeId) => {
    return updateNodeUsedDiskSpace(nodeId);
  });
  ipcMain.handle('getSystemFreeDiskSpace', () => {
    return getSystemFreeDiskSpace();
  });
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
  ipcMain.handle('getMainProcessUsage', getMainProcessUsage);
  ipcMain.handle('checkSystemHardware', checkSystemHardware);
  ipcMain.handle('getSystemInfo', getSystemInfo);

  // Multi-nodegetUserNodes
  ipcMain.handle('getNodes', getNodes);
  ipcMain.handle('getUserNodes', getUserNodes);
  ipcMain.handle(
    'addEthereumNode',
    (
      _event,
      ecNodeSpec: NodeSpecification,
      ccNodeSpec: NodeSpecification,
      settings: { storageLocation?: string }
    ): Promise<{ ecNode: Node; ccNode: Node }> => {
      return addEthereumNode(ecNodeSpec, ccNodeSpec, settings);
    }
  );
  ipcMain.handle(
    'addNode',
    (_event, nodeSpec: NodeSpecification, storageLocation?: string) => {
      return addNode(nodeSpec, storageLocation);
    }
  );
  ipcMain.handle(
    'updateNode',
    (_event, nodeId: NodeId, propertiesToUpdate: any) => {
      return updateNodeProperties(nodeId, propertiesToUpdate);
    }
  );
  ipcMain.handle(
    'removeNode',
    (_event, nodeId: NodeId, options: { isDeleteStorage: boolean }) => {
      return removeNode(nodeId, options);
    }
  );
  ipcMain.handle('startNode', (_event, nodeId: NodeId) => {
    return startNode(nodeId);
  });
  ipcMain.handle('getNodeStartCommand', (_event, nodeId: NodeId) => {
    return getNodeStartCommand(nodeId);
  });
  ipcMain.handle('stopNode', (_event, nodeId: NodeId) => {
    return stopNode(nodeId);
  });
  ipcMain.handle(
    'updateNodeDataDir',
    (_event, nodeId: NodeId, newDataDir: string) => {
      return updateNodeDataDir(nodeId, newDataDir);
    }
  );
  ipcMain.handle('openDialogForNodeDataDir', (_event, nodeId: NodeId) => {
    return openDialogForNodeDataDir(nodeId);
  });
  ipcMain.handle('openDialogForStorageLocation', () => {
    return openDialogForStorageLocation();
  });
  ipcMain.handle('deleteNodeStorage', (_event, nodeId: NodeId) => {
    return deleteNodeStorage(nodeId);
  });
  ipcMain.handle('sendNodeLogs', (_event, nodeId: NodeId) => {
    return sendNodeLogs(nodeId);
  });
  ipcMain.handle('stopSendingNodeLogs', (_event, nodeId?: NodeId) => {
    return stopSendingNodeLogs(nodeId);
  });

  // Default Node storage location
  ipcMain.handle('getNodesDefaultStorageLocation', getNodesDirPathDetails);

  // Node library
  ipcMain.handle('getNodeLibrary', getNodeLibrary);

  // Docker
  ipcMain.handle('getIsDockerInstalled', isDockerInstalled);
  ipcMain.handle('installDocker', installDocker);
  ipcMain.handle('getIsDockerRunning', isDockerRunning);
  ipcMain.handle('startDocker', startDocker);

  // Settings
  ipcMain.handle('getSetHasSeenSplashscreen', (_event, hasSeen?: boolean) => {
    return getSetHasSeenSplashscreen(hasSeen);
  });
  ipcMain.handle('getSettings', getSettings);
  ipcMain.handle('setLanguage', (_event, languageCode: string) => {
    return setLanguage(languageCode);
  });
  ipcMain.handle('setThemeSetting', (_event, theme: ThemeSetting) => {
    return setThemeSetting(theme);
  });
  ipcMain.handle('setIsOpenOnStartup', (_event, isOpenOnStartup: boolean) => {
    return setIsOpenOnStartup(isOpenOnStartup);
  });
};
