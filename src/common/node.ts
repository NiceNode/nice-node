/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';
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
  nodeConfigTranslationValues: Record<string, any>;
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
    memory?: number;
    cpu?: number;
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
  // get default node data dir, make data dir, (clear?)
  // parse spec.execution.input.defaultConfig : {
  //  key, value
  // }
  let initialNodeConfigTranslationValues = {};
  if (input.spec.execution?.input?.defaultConfig) {
    initialNodeConfigTranslationValues =
      input.spec.execution?.input?.defaultConfig;
  }
  const node: Node = {
    id: uuidv4(),
    spec: input.spec,
    config: { nodeConfigTranslationValues: initialNodeConfigTranslationValues },
    runtime: input.runtime,
    status: NodeStatus.created,
  };
  return node;
};
export default Node;
