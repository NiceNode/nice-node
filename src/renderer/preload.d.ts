/* eslint-disable no-unused-vars */
import {
  NodeSpecification,
  NodePackageSpecification,
} from '../common/nodeSpec';
import Node, {
  NodeId,
  UserNodePackages,
  UserNodes,
  NodePackage,
} from '../common/node';
import { AddNodePackageNodeService } from '../main/nodePackageManager';
import { NodeLibrary, NodePackageLibrary } from '../main/state/nodeLibrary';
import { Settings, ThemeSetting } from '../main/state/settings';
import { CheckStorageDetails } from '../main/files';
import { FailSystemRequirementsData } from '../main/minSystemRequirement';
import { SystemData } from '../main/systemInfo';
import { ConfigValuesMap } from '../common/nodeConfig';
import { PodmanDetails } from '../main/podman/details';
import { Benchmark } from '../main/state/benchmark';

// Since we are using Chrome only in Electron and this is not a web standard yet,
//  we extend window.performance to include Chrome's memory stats
interface Performance extends Performance {
  memory?: {
    /** The maximum size of the heap, in bytes, that is available to the context. */
    jsHeapSizeLimit: number;
    /** The total allocated heap size, in bytes. */
    totalJSHeapSize: number;
    /** The currently active segment of JS heap, in bytes. */
    usedJSHeapSize: number;
  };
}

declare global {
  interface Window {
    electron: {
      SENTRY_DSN: string;
      ipcRenderer: {
        on(channel: string, func: (...args: any[]) => void): void;
        once(channel: string, func: (...args: any[]) => void): void;
        removeListener(
          channel: string,
          listener: (...args: any[]) => void,
        ): void;
        removeAllListeners(channel: string): void;
      };
      getSystemFreeDiskSpace(): number;
      getSystemDiskSize(): number;
      getDebugInfo(): any;
      getStoreValue(key: string): any;
      setStoreValue(key: string, value: any): void;
      getGethLogs(): any;
      getGethErrorLogs(): any;
      getRendererProcessUsage(): any;
      getMainProcessUsage(): any;
      checkSystemHardware(): string[];
      getSystemInfo(): SystemData;
      getBenchmarks(): Benchmark[];
      runBenchmark(): Benchmark;
      getFailSystemRequirements(): Promise<FailSystemRequirementsData>;
      closeApp(): void;

      // Multi-node
      getNodes(): Node[];
      getUserNodes(): UserNodes;
      getUserNodePackages(): UserNodePackages;
      startNodePackage(nodeId: NodeId): void;
      stopNodePackage(nodeId: NodeId): void;
      removeNodePackage(
        nodeId: NodeId,
        options: { isDeleteStorage: boolean },
      ): Node;
      addNodePackage(
        nodeSpec: NodePackageSpecification,
        services: AddNodePackageNodeService[],
        settings: {
          storageLocation?: string;
          configValues?: ConfigValuesMap;
        },
      ): { node: NodePackage };
      addNode(nodeSpec: NodeSpecification, storageLocation?: string): Node;
      updateNode(nodeId: NodeId, propertiesToUpdate: any): Node;
      removeNode(nodeId: NodeId, options: { isDeleteStorage: boolean }): Node;
      startNode(nodeId: NodeId): void;
      getNodeStartCommand(nodeId: NodeId): string;
      stopNode(nodeId: NodeId): void;
      updateNodeDataDir(node: Node, newDataDir: string): void;
      openDialogForNodeDataDir(nodeId: NodeId): string;
      openDialogForStorageLocation(): CheckStorageDetails;
      updateNodeLastSyncedBlock(nodeId: NodeId, block: number): void;
      deleteNodeStorage(nodeId: NodeId): boolean;
      resetNodeConfig(nodeId: NodeId): boolean;
      sendNodeLogs(nodeId: NodeId): void;
      stopSendingNodeLogs(nodeId?: NodeId): void;

      // Default Node storage location
      getNodesDefaultStorageLocation(): CheckStorageDetails;

      // Node library
      getNodeLibrary(): NodeLibrary;
      getNodePackageLibrary(): NodePackageLibrary;

      // Podman
      getIsPodmanInstalled(): boolean;
      installPodman(): any;
      getIsPodmanRunning(): true;
      getPodmanDetails(): PodmanDetails;
      startPodman(): any;
      updatePodman(): any;

      // Settings
      getSetHasSeenSplashscreen(hasSeen?: boolean): boolean;
      getSetHasSeenAlphaModal(hasSeen?: boolean): boolean;
      getSettings(): Settings;
      getAppClientId(): string;
      setLanguage(languageCode: string): void;
      setNativeThemeSetting(theme: ThemeSetting): void;
      setThemeSetting(theme: ThemeSetting): void;
      setIsOpenOnStartup(isOpenOnStartup: boolean): void;
      getSetIsNotificationsEnabled(isNotificationsEnabled?: boolean): void;
      setIsEventReportingEnabled(isEventReportingEnabled: boolean): void;

      // Notifications
      getNotifications(): any;
      addNotification(notification: any): void;
      removeNotifications(): void;
      markAllAsRead(): void;

      // Ports
      checkPorts(ports: number[]): void;
    };

    performance: Performance;
  }
}

export {};
