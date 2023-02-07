import { contextBridge, ipcRenderer } from 'electron';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeSpecification } from '../common/nodeSpec';
import { CHANNELS_ARRAY } from './messenger';
import { NodeId } from '../common/node';
import { ThemeSetting } from './state/settings';

contextBridge.exposeInMainWorld('electron', {
  SENTRY_DSN: process.env.SENTRY_DSN,
  ipcRenderer: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(channel: string, func: (...args: any[]) => void) {
      const validChannels = CHANNELS_ARRAY;
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      } else {
        console.error('IPC message not on a valid channel!');
      }
    },
    removeListener(channel: string, listener: (...args: any[]) => void) {
      ipcRenderer.removeListener(channel, listener);
      console.log(`Removed ${channel} channel listener.`);
    },
    removeAllListeners(channel: string) {
      ipcRenderer.removeAllListeners(channel);
      console.log(`Removed all listeners on ${channel} channel.`);
    },
  },
  updateNodeUsedDiskSpace: (nodeId: NodeId) =>
    ipcRenderer.invoke('updateNodeUsedDiskSpace', nodeId),
  getSystemFreeDiskSpace: () => ipcRenderer.invoke('getSystemFreeDiskSpace'),
  getDebugInfo: () => ipcRenderer.invoke('getDebugInfo'),
  getStoreValue: (key: string) => ipcRenderer.invoke('getStoreValue', key),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStoreValue: (key: string, value: any) =>
    ipcRenderer.invoke('setStoreValue', key, value),
  getGethLogs: () => ipcRenderer.invoke('getGethLogs'),
  getGethErrorLogs: () => ipcRenderer.invoke('getGethErrorLogs'),
  getMainProcessUsage: () => ipcRenderer.invoke('getMainProcessUsage'),
  getRendererProcessUsage: async () => {
    const memory = await process.getProcessMemoryInfo();
    const cpu = await process.getCPUUsage();
    return { memory, cpu };
  },
  checkSystemHardware: () => ipcRenderer.invoke('checkSystemHardware'),
  getSystemInfo: () => ipcRenderer.invoke('getSystemInfo'),

  // Multi-node
  getNodes: () => ipcRenderer.invoke('getNodes'),
  getUserNodes: () => ipcRenderer.invoke('getUserNodes'),
  addEthereumNode: async (
    ecNodeSpec: NodeSpecification,
    ccNodeSpec: NodeSpecification,
    settings: { storageLocation?: string }
  ) => {
    return ipcRenderer.invoke(
      'addEthereumNode',
      ecNodeSpec,
      ccNodeSpec,
      settings
    );
  },
  addNode: (nodeSpec: NodeSpecification, storageLocation?: string) =>
    ipcRenderer.invoke('addNode', nodeSpec, storageLocation),
  updateNode: (nodeId: NodeId, propertiesToUpdate: any) =>
    ipcRenderer.invoke('updateNode', nodeId, propertiesToUpdate),

  removeNode: (nodeId: NodeId, options: { isDeleteStorage: boolean }) =>
    ipcRenderer.invoke('removeNode', nodeId, options),
  startNode: (nodeId: NodeId) => {
    ipcRenderer.invoke('startNode', nodeId);
  },
  getNodeStartCommand: (nodeId: NodeId) => {
    return ipcRenderer.invoke('getNodeStartCommand', nodeId);
  },
  stopNode: (nodeId: NodeId) => {
    ipcRenderer.invoke('stopNode', nodeId);
  },
  updateNodeDataDir: (nodeId: NodeId, newDataDir: string) =>
    ipcRenderer.invoke('updateNodeDataDir', nodeId, newDataDir),
  openDialogForNodeDataDir: (nodeId: NodeId) =>
    ipcRenderer.invoke('openDialogForNodeDataDir', nodeId),
  openDialogForStorageLocation: () =>
    ipcRenderer.invoke('openDialogForStorageLocation'),
  deleteNodeStorage: (nodeId: NodeId) =>
    ipcRenderer.invoke('deleteNodeStorage', nodeId),
  sendNodeLogs: (nodeId: NodeId) => {
    ipcRenderer.invoke('sendNodeLogs', nodeId);
  },
  stopSendingNodeLogs: (nodeId?: NodeId) => {
    ipcRenderer.invoke('stopSendingNodeLogs', nodeId);
  },

  // Default Node storage location
  getNodesDefaultStorageLocation: () =>
    ipcRenderer.invoke('getNodesDefaultStorageLocation'),

  // Node library
  getNodeLibrary: () => ipcRenderer.invoke('getNodeLibrary'),

  // Docker
  getIsDockerInstalled: () => ipcRenderer.invoke('getIsDockerInstalled'),
  installDocker: () => ipcRenderer.invoke('installDocker'),
  getIsDockerRunning: () => ipcRenderer.invoke('getIsDockerRunning'),
  startDocker: () => ipcRenderer.invoke('startDocker'),

  // Settings
  getSetHasSeenSplashscreen: (hasSeen?: boolean) =>
    ipcRenderer.invoke('getSetHasSeenSplashscreen', hasSeen),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  setLanguage: (languageCode: string) => {
    ipcRenderer.invoke('setLanguage', languageCode);
  },
  setThemeSetting: (theme: ThemeSetting) => {
    ipcRenderer.invoke('setThemeSetting', theme);
  },
  setIsOpenOnStartup: (isOpenOnStartup: boolean) => {
    ipcRenderer.invoke('setIsOpenOnStartup', isOpenOnStartup);
  },
});
