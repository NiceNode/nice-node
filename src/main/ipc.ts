import { ipcMain, app } from 'electron';
import getDebugInfo from './debug';
import {
  getGethLogs,
  getGethErrorLogs,
  getSystemFreeDiskSpace,
  getNodesDirPathDetails,
  getSystemDiskSize,
} from './files';
import store from './state/store';
import logger from './logger';
import {
  checkSystemHardware,
  getMainProcessUsage,
  updateNodeLastSyncedBlock,
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
  resetNodeConfig,
} from './nodeManager';
import { getNodes, getUserNodes, updateNodeProperties } from './state/nodes';
import { getUserNodePackages } from './state/nodePackages';
import Node, { NodeId, NodePackage, NodeStoppedBy } from '../common/node';
import { ConfigValuesMap } from '../common/nodeConfig';
import {
  NodePackageSpecification,
  NodeSpecification,
} from '../common/nodeSpec';
import { isPodmanInstalled, isPodmanRunning } from './podman/podman';
import installPodman from './podman/install/install';
// eslint-disable-next-line import/no-cycle
import {
  openDialogForNodeDataDir,
  openDialogForStorageLocation,
  updateNodeDataDir,
} from './dialog';
import { getNodeLibrary, getNodePackageLibrary } from './state/nodeLibrary';
import {
  getSetHasSeenAlphaModal,
  getSetHasSeenSplashscreen,
  getSettings,
  setIsOpenOnStartup,
  getSetIsNotificationsEnabled,
  setNativeThemeSetting,
  setThemeSetting,
  ThemeSetting,
  setIsEventReportingEnabled,
} from './state/settings';
import { getSystemInfo } from './systemInfo';
import startPodman from './podman/start';
import {
  addNotification,
  getNotifications,
  removeNotifications,
  markAllAsRead,
} from './state/notifications';
import { getFailSystemRequirements } from './minSystemRequirement';
import {
  AddNodePackageNodeService,
  addNodePackage,
  removeNodePackage,
  startNodePackage,
  stopNodePackage,
} from './nodePackageManager';
import { checkPorts } from './ports';
import { getAppClientId } from './state/eventReporting';
import { onUserChangedLanguage } from './i18nMain';

// eslint-disable-next-line import/prefer-default-export
export const initialize = () => {
  ipcMain.handle(
    'updateNodeLastSyncedBlock',
    (_event, nodeId: NodeId, block: number) => {
      return updateNodeLastSyncedBlock(nodeId, block);
    },
  );
  ipcMain.handle('getSystemFreeDiskSpace', () => {
    return getSystemFreeDiskSpace();
  });
  ipcMain.handle('getSystemDiskSize', () => {
    return getSystemDiskSize();
  });
  ipcMain.handle('getDebugInfo', getDebugInfo);
  ipcMain.handle('getStoreValue', (_event, key: string) => {
    const value = store.get(key);
    logger.info(`store.get(key, value): ${key},${value}`);
    return value;
  });
  // eslint-disable-next-line
  ipcMain.handle('setStoreValue', (_event, key: string, value: any) => {
    logger.info(`store.set(key, value): ${key},${value}`);
    return store.set(key, value);
  });
  ipcMain.handle('getGethLogs', getGethLogs);
  ipcMain.handle('getGethErrorLogs', getGethErrorLogs);
  ipcMain.handle('getMainProcessUsage', getMainProcessUsage);
  ipcMain.handle('checkSystemHardware', checkSystemHardware);
  ipcMain.handle('getSystemInfo', getSystemInfo);
  ipcMain.handle('getFailSystemRequirements', getFailSystemRequirements);
  ipcMain.handle('closeApp', () => app.quit());

  // Multi-nodegetUserNodes
  ipcMain.handle('getNodes', getNodes);
  ipcMain.handle('getUserNodes', getUserNodes);
  ipcMain.handle('getUserNodePackages', getUserNodePackages);

  ipcMain.handle(
    'addNodePackage',
    async (
      _event,
      nodeSpec: NodePackageSpecification,
      services: AddNodePackageNodeService[],
      settings: { storageLocation?: string; configValues?: ConfigValuesMap },
    ): Promise<{ node: NodePackage }> => {
      const node = await addNodePackage(nodeSpec, services, settings);
      return { node };
    },
  );
  ipcMain.handle(
    'removeNodePackage',
    (_event, nodeId: NodeId, options: { isDeleteStorage: boolean }) => {
      return removeNodePackage(nodeId, options);
    },
  );
  ipcMain.handle('startNodePackage', (_event, nodeId: NodeId) => {
    return startNodePackage(nodeId);
  });
  ipcMain.handle('stopNodePackage', (_event, nodeId: NodeId) => {
    return stopNodePackage(nodeId, NodeStoppedBy.user);
  });
  ipcMain.handle(
    'addNode',
    (_event, nodeSpec: NodeSpecification, storageLocation?: string) => {
      return addNode(nodeSpec, storageLocation);
    },
  );
  ipcMain.handle(
    'updateNode',
    (_event, nodeId: NodeId, propertiesToUpdate: any) => {
      return updateNodeProperties(nodeId, propertiesToUpdate);
    },
  );
  ipcMain.handle(
    'removeNode',
    (_event, nodeId: NodeId, options: { isDeleteStorage: boolean }) => {
      return removeNode(nodeId, options);
    },
  );
  ipcMain.handle('startNode', (_event, nodeId: NodeId) => {
    return startNode(nodeId);
  });
  ipcMain.handle('getNodeStartCommand', (_event, nodeId: NodeId) => {
    return getNodeStartCommand(nodeId);
  });
  ipcMain.handle('stopNode', (_event, nodeId: NodeId) => {
    return stopNode(nodeId, NodeStoppedBy.user);
  });
  ipcMain.handle(
    'updateNodeDataDir',
    (_event, node: Node, newDataDir: string) => {
      return updateNodeDataDir(node, newDataDir);
    },
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
  ipcMain.handle('resetNodeConfig', (_event, nodeId: NodeId) => {
    return resetNodeConfig(nodeId);
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
  ipcMain.handle('getNodePackageLibrary', getNodePackageLibrary);

  // Podman
  ipcMain.handle('getIsPodmanInstalled', isPodmanInstalled);
  ipcMain.handle('installPodman', installPodman);
  ipcMain.handle('getIsPodmanRunning', isPodmanRunning);
  ipcMain.handle('startPodman', startPodman);

  // Settings
  ipcMain.handle('getSetHasSeenSplashscreen', (_event, hasSeen?: boolean) => {
    return getSetHasSeenSplashscreen(hasSeen);
  });
  ipcMain.handle('getSetHasSeenAlphaModal', (_event, hasSeen?: boolean) => {
    return getSetHasSeenAlphaModal(hasSeen);
  });
  ipcMain.handle('getSettings', getSettings);
  ipcMain.handle('getAppClientId', getAppClientId);
  ipcMain.handle('setLanguage', (_event, languageCode: string) => {
    return onUserChangedLanguage(languageCode);
  });
  ipcMain.handle('setNativeThemeSetting', (_event, theme: ThemeSetting) => {
    return setNativeThemeSetting(theme);
  });
  ipcMain.handle('setThemeSetting', (_event, theme: ThemeSetting) => {
    return setThemeSetting(theme);
  });
  ipcMain.handle('setIsOpenOnStartup', (_event, isOpenOnStartup: boolean) => {
    return setIsOpenOnStartup(isOpenOnStartup);
  });
  ipcMain.handle(
    'getSetIsNotificationsEnabled',
    (_event, isNotificationsEnabled?: boolean) => {
      return getSetIsNotificationsEnabled(isNotificationsEnabled);
    },
  );
  ipcMain.handle(
    'setIsEventReportingEnabled',
    (_event, isEventReportingEnabled: boolean) => {
      return setIsEventReportingEnabled(isEventReportingEnabled);
    },
  );

  // Notifications
  ipcMain.handle('getNotifications', getNotifications);
  ipcMain.handle('addNotification', async (_event, notification) => {
    return addNotification(notification);
  });
  ipcMain.handle('removeNotifications', removeNotifications);
  ipcMain.handle('markAllAsRead', markAllAsRead);

  // Ports
  ipcMain.handle('checkPorts', (_event, ports: number[]) => {
    return checkPorts(ports);
  });
};
