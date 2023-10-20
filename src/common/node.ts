/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';
import { ConfigValuesMap } from './nodeConfig';
import {
  ExecutionTypes,
  NodePackageSpecification,
  NodeSpecification,
} from './nodeSpec';

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
  error = 'error',
  updating = 'updating',
}

export type NodeConfig = {
  executionType?: ExecutionTypes;
  configValuesMap: ConfigValuesMap;
};

export type MetricData = {
  x: number;
  y: number;
};
export type MetricMap = Record<string, MetricData>;
/**
 * @property processIds is either containerIds or childProcessIds
 */
export type NodeRuntime = {
  build?: string;
  // execPath?: string;
  dataDir: string;
  processIds?: string[];
  initialized?: boolean;
  usage: {
    diskGBs: MetricData[] | [];
    memoryBytes: MetricData[] | [];
    cpuPercent: MetricData[] | [];
    syncedBlock: number;
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
export type NodeService = {
  serviceId: string;
  serviceName: string;
  node: Node;
};
export type NodePackage = {
  nodes: Node[];
  id: NodeId;
  services: NodeService[];
  spec: NodePackageSpecification;
  config: NodeConfig;
  runtime: NodeRuntime;
  status: NodeStatus;
  lastStarted?: string;
  lastStopped?: string;
};
type NodePackageMap = Record<string, NodePackage>;
export type UserNodePackages = {
  nodes: NodePackageMap;
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
  initialConfigFromUser?: ConfigValuesMap;
}): Node => {
  let initialConfigValues: ConfigValuesMap = {};
  if (input.spec.execution?.input?.defaultConfig) {
    initialConfigValues = input.spec.execution?.input?.defaultConfig;
  }

  // initial config from user overrides default config
  if (input.initialConfigFromUser) {
    initialConfigValues = {
      ...initialConfigValues,
      ...input.initialConfigFromUser,
    };
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
export const createNodePackage = (input: {
  spec: NodePackageSpecification;
  runtime: NodeRuntime;
  initialConfigFromUser?: ConfigValuesMap;
}): NodePackage => {
  let initialConfigValues: ConfigValuesMap = {};
  if (input.spec.execution?.input?.defaultConfig) {
    initialConfigValues = input.spec.execution?.input?.defaultConfig;
  }

  // initial config from user overrides default config
  if (input.initialConfigFromUser) {
    initialConfigValues = {
      ...initialConfigValues,
      ...input.initialConfigFromUser,
    };
  }

  // The data directory is default set to the NiceNode nodes directory
  //  Config in the node spec can override this.
  if (!initialConfigValues.dataDir) {
    initialConfigValues.dataDir = input.runtime.dataDir;
  }

  const nodePackage: NodePackage = {
    nodes: [],
    id: uuidv4(),
    spec: input.spec,
    services: [],
    config: { configValuesMap: initialConfigValues },
    runtime: input.runtime,
    status: NodeStatus.created,
  };
  return nodePackage;
};
export default Node;
