/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';
import { ExecutionTypes, NodeSpecification } from './nodeSpec';

export type NodeId = string;

export enum NodeStatus {
  created = 'created',
  initializing = 'initializing',
  downloading = 'downloading',
  downloaded = 'downloaded',
  errorDownloading = 'error downloading',
  extracting = 'extracting',
  readyToStart = 'ready to start',
  starting = 'starting',
  running = 'running',
  stopping = 'stopping',
  stopped = 'stopped',
  errorStarting = 'error starting',
  errorStopping = 'error stopping',
}

export type NodeUserConfig = {
  executionType?: ExecutionTypes;
};

/**
 * @property processIds is either containerIds or childProcessIds
 */
export type NodeMonitoring = {
  processIds?: string[];
};

type Node = {
  id: NodeId;
  spec: NodeSpecification;
  userConfig: NodeUserConfig;
  monitoring: NodeMonitoring;
  status: NodeStatus;
  lastStarted?: string;
  lastStopped?: string;
};

export const isDockerNode = (node: Node) => {
  // userConfig takes priority, then default type, then the first option
  if (node.userConfig.executionType) {
    return node.userConfig.executionType === 'docker';
  }
  if (node.spec.execution.defaultExecutionType) {
    return node.spec.execution.defaultExecutionType === 'docker';
  }
  return node.spec.execution.executionTypes[0] === 'docker';
};
export const isBinaryNode = (node: Node) => {
  // userConfig takes priority, then default type, then the first option
  if (node.userConfig.executionType) {
    return node.userConfig.executionType === 'binary';
  }
  if (node.spec.execution.defaultExecutionType) {
    return node.spec.execution.defaultExecutionType === 'binary';
  }
  return node.spec.execution.executionTypes[0] === 'binary';
};
export const createNode = (spec: NodeSpecification): Node => {
  const node: Node = {
    id: uuidv4(),
    spec,
    userConfig: {},
    monitoring: {},
    status: NodeStatus.created,
  };
  return node;
};
export default Node;
