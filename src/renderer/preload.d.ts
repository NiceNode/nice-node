/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeSpecification } from '../common/nodeSpec';
import { Node, NodeId } from '../common/node';
import { NodeLibrary } from '../main/state/nodeLibrary';
import { Settings } from '../main/state/settings';
import { CheckStorageDetails } from '../main/files';
import { SystemData } from '../main/systemInfo';

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
          listener: (...args: any[]) => void
        ): void;
        removeAllListeners(channel: string): void;
      };
      getSystemFreeDiskSpace(): number;
      getDebugInfo(): any;
      getStoreValue(key: string): any;
      setStoreValue(key: string, value: any): void;
      getGethLogs(): any;
      getGethErrorLogs(): any;
      getRendererProcessUsage(): any;
      getMainProcessUsage(): any;
      checkSystemHardware(): string[];
      getSystemInfo(): SystemData;

      // Multi-node
      getNodes(): Node[];
      getUserNodes(): UserNodes;
      addNode(nodeSpec: NodeSpecification, storageLocation?: string): Node;
      updateNode(nodeId: NodeId, propertiesToUpdate: any): Node;
      removeNode(nodeId: NodeId, options: { isDeleteStorage: boolean }): Node;
      startNode(nodeId: NodeId): void;
      stopNode(nodeId: NodeId): void;
      openDialogForNodeDataDir(nodeId: NodeId): void;
      openDialogForStorageLocation(): CheckStorageDetails;
      updateNodeUsedDiskSpace(nodeId: NodeId): void;
      deleteNodeStorage(nodeId: NodeId): boolean;
      sendNodeLogs(nodeId: NodeId): void;
      stopSendingNodeLogs(nodeId?: NodeId): void;

      // Default Node storage location
      getNodesDefaultStorageLocation(): CheckStorageDetails;

      // Node library
      getNodeLibrary(): NodeLibrary;

      // Docker
      getIsDockerInstalled(): boolean;
      installDocker(): any;
      getIsDockerRunning(): true;
      startDocker(): any;

      // Settings
      getHasSeenSplashscreen(hasSeen?: boolean): boolean;
      getSettings(): Settings;
      setLanguage(languageCode: string): void;
    };

    performance: Performance;
  }
}

export {};
