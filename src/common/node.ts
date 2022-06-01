/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';
import { runtime } from 'webpack';
import { ConfigValuesMap } from './nodeConfig';
import { ExecutionTypes, NodeSpecification } from './nodeSpec';

export type NodeId = string;

export enum NodeStatus {
  created = 'created',
  initializing = 'initializing',
  checkingForUpdates = 'checkingForUpdates',
  downloading = 'downloading',
  downloaded = 'downloaded',
  errorDownloading = 'error downloading',
  extracting = 'extracting',
  readyToStart = 'ready to start',
  starting = 'starting',
  running = 'running',
  stopping = 'stopping',
  stopped = 'stopped',
  errorRunning = 'error running',
  errorStarting = 'error starting',
  errorStopping = 'error stopping',
  unknown = 'unknown',
}

export type NodeConfig = {
  executionType?: ExecutionTypes;
  configValuesMap: ConfigValuesMap;
};

/**
 * @property processIds is either containerIds or childProcessIds
 */
export type NodeRuntime = {
  build?: string;
  // execPath?: string;
  dataDir: string;
  processIds?: string[];
  usage: {
    diskGBs?: number;
    memoryBytes?: number;
    cpuPercent?: number;
  };
};

type Node = {
  id: NodeId;
  spec: NodeSpecification;
  config: NodeConfig;
  runtime: NodeRuntime;
  status: NodeStatus;
  lastStarted?: string;
  lastStopped?: string;
};
type NodeMap = Record<string, Node>;
export type UserNodes = {
  nodes: NodeMap;
  nodeIds: string[];
};

export const isDockerNode = (node: Node) => {
  // config takes priority, then default type, then the first option
  if (node.config?.executionType) {
    return node.config?.executionType === 'docker';
  }
  if (node.spec.execution.defaultExecutionType) {
    return node.spec.execution.defaultExecutionType === 'docker';
  }
  return node.spec.execution.executionTypes[0] === 'docker';
};
export const isBinaryNode = (node: Node) => {
  // config takes priority, then default type, then the first option
  if (node.config?.executionType) {
    return node.config?.executionType === 'binary';
  }
  if (node.spec.execution.defaultExecutionType) {
    return node.spec.execution.defaultExecutionType === 'binary';
  }
  return node.spec.execution.executionTypes[0] === 'binary';
};
export const createNode = (input: {
  spec: NodeSpecification;
  runtime: NodeRuntime;
}): Node => {
  let initialConfigValues: ConfigValuesMap = {};
  if (input.spec.execution?.input?.defaultConfig) {
    initialConfigValues = input.spec.execution?.input?.defaultConfig;
  }
  // The data directory is default set to the NiceNode nodes directory
  //  Config in the node spec can override this.
  if (!initialConfigValues.dataDir) {
    initialConfigValues.dataDir = input.runtime.dataDir;
  }

  const node: Node = {
    id: uuidv4(),
    spec: input.spec,
    config: { configValuesMap: initialConfigValues },
    runtime: input.runtime,
    status: NodeStatus.created,
  };
  return node;
};
export default Node;
