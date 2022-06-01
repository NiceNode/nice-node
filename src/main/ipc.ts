import { ipcMain } from 'electron';
import getDebugInfo from './debug';
import { getGethLogs, getGethErrorLogs, getSystemFreeDiskSpace } from './files';
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
} from './nodeManager';
import { getNodes, getUserNodes, updateNodeProperties } from './state/nodes';
import { NodeId } from '../common/node';
import { NodeSpecification } from '../common/nodeSpec';
import { isDockerInstalled } from './docker/docker';
import { openDialogForNodeDataDir } from './dialog';
import { getNodeLibrary } from './state/nodeLibrary';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  ipcMain.handle('updateNodeUsedDiskSpace', (_event, nodeId: NodeId) => {
    return updateNodeUsedDiskSpace(nodeId);
  });
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
  ipcMain.handle('getMainProcessUsage', getMainProcessUsage);
  ipcMain.handle('checkSystemHardware', checkSystemHardware);

  // Multi-nodegetUserNodes
  ipcMain.handle('getNodes', getNodes);
  ipcMain.handle('getUserNodes', getUserNodes);
  ipcMain.handle('addNode', (_event, nodeSpec: NodeSpecification) => {
    return addNode(nodeSpec);
  });
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
  ipcMain.handle('stopNode', (_event, nodeId: NodeId) => {
    return stopNode(nodeId);
  });
  ipcMain.handle('openDialogForNodeDataDir', (_event, nodeId: NodeId) => {
    return openDialogForNodeDataDir(nodeId);
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

  // Node library
  ipcMain.handle('getNodeLibrary', getNodeLibrary);

  // Settings/Config
  ipcMain.handle('getIsDockerInstalled', isDockerInstalled);
};
