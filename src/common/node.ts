import { v4 as uuidv4 } from 'uuid';
import type { ConfigValuesMap } from './nodeConfig';
import type {
  ExecutionTypes,
  NodePackageSpecification,
  NodeSpecification,
  DockerExecution as PodmanExecution,
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

export enum NodeStoppedBy {
  user = 'user',
  shutdown = 'shutdown',
  podmanUpdate = 'podmanUpdate',
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
  /**
   * Timestamp the node was first created, UTC milliseconds
   */
  createdTimestampMs: number;
  lastRunningTimestampMs?: number;
  lastStartedTimestampMs?: number;
  lastStoppedTimestampMs?: number;
  stoppedBy?: NodeStoppedBy;
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
  /**
   * Timestamp the node was first created, UTC milliseconds
   */
  createdTimestampMs: number;
  /**
   * When the Node Package was most recently detected as running properly.
   * Definition: "running properly" means the node was running for at least 30 seconds
   */
  lastRunningTimestampMs?: number;
  /**
   * When the Node Package was most recently started.
   * (Does not indicate that it successfully started, see lastRunningTimestampMs)
   */
  lastStartedTimestampMs?: number;
  /**
   * When the Node Package was most recently stopped.
   */
  lastStoppedTimestampMs?: number;
  /**
   * Sets what stopped the Node Package.
   * Examples: 'shutdown', 'user', 'crash', or undefined if the node is running
   */
  stoppedBy?: NodeStoppedBy;
};
export type NodePackageMap = Record<string, NodePackage>;

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
    createdTimestampMs: Date.now(),
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
    createdTimestampMs: Date.now(),
  };
  return nodePackage;
};

/**
 * This naming convention supports a user running two of the same nodes,
 * while still being human-readable.
 * Returns just the specId for backwards compatibility.
 * @param node
 * @returns "node.spec.specId-node.createdTimestampMs"
 */
export const getContainerName = (node: Node): string => {
  const specId = node.spec.specId;
  const conatinerName = node.createdTimestampMs
    ? `${specId}-${node.createdTimestampMs}`
    : specId;
  return conatinerName;
};

/**
 * @param node a node that runs with a container
 * @returns imageTag set by user, spec, or latest if not set
 */
export const getImageTag = (node: Node): string => {
  const { execution } = node.spec;
  const { imageName, defaultImageTag } = execution as PodmanExecution;

  let imageTag = 'latest';

  // backwards compatible with old spec files which include image tags in the names
  //   : matches the colon character.
  // \S matches any non-whitespace character.
  // + indicates one or more of the preceding character (non-whitespace characters in this case).
  // $ asserts the position at the end of the string.
  const imageNameEndsWithTagRegex = /:\S+$/;
  if (imageNameEndsWithTagRegex.test(imageName)) {
    imageTag = '';
  } else if (node.config.configValuesMap?.serviceVersion) {
    imageTag = node.config.configValuesMap?.serviceVersion;
  } else if (defaultImageTag) {
    // defaultImageTag is set in node.spec.execution
    imageTag = defaultImageTag;
  }
  return imageTag;
};
export default Node;
