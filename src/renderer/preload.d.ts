/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeSpecification } from '../common/nodeSpec';
import { Node, NodeId } from '../common/node';
import { NodeLibrary } from '../main/state/nodeLibrary';

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

      // Multi-node
      getNodes(): Node[];
      getUserNodes(): UserNodes;
      addNode(nodeSpec: NodeSpecification): Node;
      updateNode(nodeId: NodeId, propertiesToUpdate: any): Node;
      removeNode(nodeId: NodeId, options: { isDeleteStorage: boolean }): Node;
      startNode(nodeId: NodeId): void;
      stopNode(nodeId: NodeId): void;
      openDialogForNodeDataDir(nodeId: NodeId): void;
      updateNodeUsedDiskSpace(nodeId: NodeId): void;
      deleteNodeStorage(nodeId: NodeId): boolean;

      // Node library
      getNodeLibrary(): NodeLibrary;

      // Settings/Config
      getIsDockerInstalled(): boolean;
    };

    performance: Performance;
  }
}

export {};
