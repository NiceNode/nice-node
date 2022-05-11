/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeSpecification } from '../common/nodeSpec';
import { Node, NodeId } from '../common/node';
import { NodeConfig } from '../main/state/nodeConfig';

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
      getGethStatus(): string;
      startGeth(): void;
      stopGeth(): void;
      deleteGethDisk(): boolean;
      getGethDiskUsed(): number;
      getSystemFreeDiskSpace(): number;
      getDebugInfo(): any;
      getStoreValue(key: string): any;
      setStoreValue(key: string, value: any): void;
      getGethLogs(): any;
      getGethErrorLogs(): any;
      getRendererProcessUsage(): any;
      getMainProcessUsage(): any;
      getNodeUsage(): any;
      getNodeConfig(node: string): NodeConfig;
      changeNodeConfig(node: string, nodeConfig: NodeConfig): void;
      setDirectInputNodeConfig(node: string, directInput: string[]): void;
      getDefaultNodeConfig(node: string): NodeConfig;
      setToDefaultNodeConfig(node: string): void;
      checkSystemHardware(): string[];

      // Multi-node
      getNodes(): Node[];
      getUserNodes(): UserNodes;
      addNode(nodeSpec: NodeSpecification): Node;
      removeNode(nodeId: NodeId): Node;
      startNode(nodeId: NodeId): void;
      stopNode(nodeId: NodeId): void;
    };

    performance: Performance;
  }
}

export {};
