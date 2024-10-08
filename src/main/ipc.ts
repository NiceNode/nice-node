import { app, ipcMain } from 'electron';
import type Node from '../common/node';
import { type NodeId, type NodePackage, NodeStoppedBy } from '../common/node';
import type { ConfigValuesMap } from '../common/nodeConfig';
import type {
  NodePackageSpecification,
  NodeSpecification,
} from '../common/nodeSpec';
import { runBenchmark } from './benchbuddy/runBenchmark';
import getDebugInfo from './debug';
import {
  openDialogForNodeDataDir,
  openDialogForStorageLocation,
  updateNodeDataDir,
} from './dialog';
import {
  getGethErrorLogs,
  getGethLogs,
  getNodesDirPathDetails,
  getSystemDiskSize,
  getSystemFreeDiskSpace,
} from './files';
import { onUserChangedLanguage } from './i18nMain';
import logger from './logger';
import { getFailSystemRequirements } from './minSystemRequirement';
import {
  checkSystemHardware,
  getMainProcessUsage,
  updateNodeLastSyncedBlock,
} from './monitor';
import { getCheckForControllerUpdate } from './nodeLibraryManager.js';
import {
  addNode,
  deleteNodeStorage,
  getNodeStartCommand,
  removeNode,
  resetNodeConfig,
  sendNodeLogs,
  startNode,
  stopNode,
  stopSendingNodeLogs,
} from './nodeManager';
import { applyNodeUpdate } from './nodeManager.js';
import {
  type AddNodePackageNodeService,
  addNodePackage,
  removeNodePackage,
  startNodePackage,
  stopNodePackage,
} from './nodePackageManager';
import { getPodmanDetails } from './podman/details';
import installPodman from './podman/install/install';
import { isPodmanInstalled, isPodmanRunning } from './podman/podman';
import startPodman from './podman/start';
import { updatePodman } from './podman/update';
import { checkPorts } from './ports';
import { getBenchmarks } from './state/benchmark';
import { getAppClientId } from './state/eventReporting';
import { getNodeLibrary, getNodePackageLibrary } from './state/nodeLibrary';
import {
  getUserNodePackages,
  updateNodePackageProperties,
} from './state/nodePackages';
import { getNodes, getUserNodes, updateNodeProperties } from './state/nodes';
import {
  addNotification,
  getNotifications,
  markAllAsRead,
  removeNotifications,
} from './state/notifications';
import {
  type ThemeSetting,
  getSetHasSeenAlphaModal,
  getSetHasSeenSplashscreen,
  getSetIsNotificationsEnabled,
  getSetIsPreReleaseUpdatesEnabled,
  getSettings,
  setIsEventReportingEnabled,
  setIsOpenOnStartup,
  setNativeThemeSetting,
  setThemeSetting,
} from './state/settings';
import { getSetIsDeveloperModeEnabled } from './state/settings.js';
import store from './state/store';
import { getSystemInfo } from './systemInfo';

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

  ipcMain.handle('setStoreValue', (_event, key: string, value: any) => {
    logger.info(`store.set(key, value): ${key},${value}`);
    return store.set(key, value);
  });
  ipcMain.handle('getGethLogs', getGethLogs);
  ipcMain.handle('getGethErrorLogs', getGethErrorLogs);
  ipcMain.handle('getMainProcessUsage', getMainProcessUsage);
  ipcMain.handle('checkSystemHardware', checkSystemHardware);
  ipcMain.handle('getSystemInfo', getSystemInfo);
  ipcMain.handle('getBenchmarks', getBenchmarks);
  ipcMain.handle('runBenchmark', runBenchmark);

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
    'updateNodePackage',
    (_event, nodeId: NodeId, propertiesToUpdate: any) => {
      return updateNodePackageProperties(nodeId, propertiesToUpdate);
    },
  );
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
  ipcMain.handle('getCheckForControllerUpdate', (_event, nodeId: NodeId) => {
    return getCheckForControllerUpdate(nodeId);
  });
  ipcMain.handle('applyNodeUpdate', (_event, nodeId: NodeId) => {
    return applyNodeUpdate(nodeId);
  });

  // Podman
  ipcMain.handle('getIsPodmanInstalled', isPodmanInstalled);
  ipcMain.handle('installPodman', installPodman);
  ipcMain.handle('getIsPodmanRunning', isPodmanRunning);
  ipcMain.handle('getPodmanDetails', getPodmanDetails);
  ipcMain.handle('startPodman', startPodman);
  ipcMain.handle('updatePodman', updatePodman);

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
  ipcMain.handle(
    'getSetIsPreReleaseUpdatesEnabled',
    (_event, isPreReleaseUpdatesEnabled?: boolean) => {
      return getSetIsPreReleaseUpdatesEnabled(isPreReleaseUpdatesEnabled);
    },
  );
  ipcMain.handle(
    'getSetIsDeveloperModeEnabled',
    (_event, isDeveloperModeEnabled?: boolean) => {
      return getSetIsDeveloperModeEnabled(isDeveloperModeEnabled);
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
