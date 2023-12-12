import { contextBridge, ipcRenderer } from 'electron';

import {
  NodePackageSpecification,
  NodeSpecification,
} from '../common/nodeSpec';
import { CHANNELS_ARRAY } from './messenger';
import { NodeId } from '../common/node';
import { ThemeSetting } from './state/settings';
import { AddNodePackageNodeService } from './nodePackageManager';
import { ConfigValuesMap } from '../common/nodeConfig';

// todo: when moving from require to imports
// const isTest = process.env.NODE_ENV === 'test';
// if (isTest) {
//   console.log('NODE_ENV=TEST... requiring wdio-electron-service/main');
//   require('wdio-electron-service/preload');
// }

contextBridge.exposeInMainWorld('electron', {
  SENTRY_DSN: process.env.SENTRY_DSN,
  ipcRenderer: {
    // eslint-disable-next-line
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
  updateNodeLastSyncedBlock: (nodeId: NodeId, block: number) =>
    ipcRenderer.invoke('updateNodeLastSyncedBlock', nodeId, block),
  getSystemFreeDiskSpace: () => ipcRenderer.invoke('getSystemFreeDiskSpace'),
  getSystemDiskSize: () => ipcRenderer.invoke('getSystemDiskSize'),
  getDebugInfo: () => ipcRenderer.invoke('getDebugInfo'),
  getStoreValue: (key: string) => ipcRenderer.invoke('getStoreValue', key),
  // eslint-disable-next-line
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
  getBenchmarks: () => ipcRenderer.invoke('getBenchmarks'),
  runBenchmark: () => ipcRenderer.invoke('runBenchmark'),

  getFailSystemRequirements: () =>
    ipcRenderer.invoke('getFailSystemRequirements'),
  closeApp: () => ipcRenderer.invoke('closeApp'),

  // Multi-node
  getNodes: () => ipcRenderer.invoke('getNodes'),
  getUserNodes: () => ipcRenderer.invoke('getUserNodes'),
  getUserNodePackages: () => ipcRenderer.invoke('getUserNodePackages'),
  startNodePackage: (nodeId: NodeId) => {
    ipcRenderer.invoke('startNodePackage', nodeId);
  },
  stopNodePackage: (nodeId: NodeId) => {
    ipcRenderer.invoke('stopNodePackage', nodeId);
  },
  removeNodePackage: (nodeId: NodeId, options: { isDeleteStorage: boolean }) =>
    ipcRenderer.invoke('removeNodePackage', nodeId, options),
  addNodePackage: async (
    nodeSpec: NodePackageSpecification,
    services: AddNodePackageNodeService[],
    settings: { storageLocation?: string; configValues?: ConfigValuesMap },
  ) => {
    return ipcRenderer.invoke('addNodePackage', nodeSpec, services, settings);
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
  updateNodeDataDir: (node: Node, newDataDir: string) =>
    ipcRenderer.invoke('updateNodeDataDir', node, newDataDir),
  openDialogForNodeDataDir: (nodeId: NodeId) =>
    ipcRenderer.invoke('openDialogForNodeDataDir', nodeId),
  openDialogForStorageLocation: () =>
    ipcRenderer.invoke('openDialogForStorageLocation'),
  deleteNodeStorage: (nodeId: NodeId) =>
    ipcRenderer.invoke('deleteNodeStorage', nodeId),
  resetNodeConfig: (nodeId: NodeId) =>
    ipcRenderer.invoke('resetNodeConfig', nodeId),
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
  getNodePackageLibrary: () => ipcRenderer.invoke('getNodePackageLibrary'),

  // Podman
  getIsPodmanInstalled: () => ipcRenderer.invoke('getIsPodmanInstalled'),
  installPodman: () => ipcRenderer.invoke('installPodman'),
  getIsPodmanRunning: () => ipcRenderer.invoke('getIsPodmanRunning'),
  getPodmanDetails: () => ipcRenderer.invoke('getPodmanDetails'),
  startPodman: () => ipcRenderer.invoke('startPodman'),
  updatePodman: () => ipcRenderer.invoke('updatePodman'),

  // Settings
  getSetHasSeenSplashscreen: (hasSeen?: boolean) =>
    ipcRenderer.invoke('getSetHasSeenSplashscreen', hasSeen),
  getSetHasSeenAlphaModal: (hasSeen?: boolean) =>
    ipcRenderer.invoke('getSetHasSeenAlphaModal', hasSeen),
  getSettings: () => ipcRenderer.invoke('getSettings'),
  getAppClientId: () => ipcRenderer.invoke('getAppClientId'),
  setLanguage: (languageCode: string) => {
    ipcRenderer.invoke('setLanguage', languageCode);
  },
  setNativeThemeSetting: (theme: ThemeSetting) => {
    ipcRenderer.invoke('setNativeThemeSetting', theme);
  },
  setThemeSetting: (theme: ThemeSetting) => {
    ipcRenderer.invoke('setThemeSetting', theme);
  },
  setIsOpenOnStartup: (isOpenOnStartup: boolean) => {
    ipcRenderer.invoke('setIsOpenOnStartup', isOpenOnStartup);
  },
  getSetIsNotificationsEnabled: (isNotificationsEnabled?: boolean) => {
    ipcRenderer.invoke('getSetIsNotificationsEnabled', isNotificationsEnabled);
  },
  setIsEventReportingEnabled: (isEventReportingEnabled: boolean) => {
    ipcRenderer.invoke('setIsEventReportingEnabled', isEventReportingEnabled);
  },
  getSetIsPreReleaseUpdatesEnabled: (isPreReleaseUpdatesEnabled?: boolean) => {
    ipcRenderer.invoke(
      'getSetIsPreReleaseUpdatesEnabled',
      isPreReleaseUpdatesEnabled,
    );
  },

  // Notifications
  getNotifications: () => ipcRenderer.invoke('getNotifications'),
  addNotification: (notification: Notification) => {
    ipcRenderer.invoke('addNotification', notification);
  },
  removeNotifications: () => ipcRenderer.invoke('removeNotifications'),
  markAllAsRead: () => ipcRenderer.invoke('markAllAsRead'),

  // Ports
  checkPorts: (ports: number[]) => {
    ipcRenderer.invoke('checkPorts', ports);
  },
});
