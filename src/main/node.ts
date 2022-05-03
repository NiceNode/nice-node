/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';

export type NodeId = string;
/**
 * @param dataPath where the node's data will be stored
 */
export type NodeOptions = {
  displayName: string;
  executionType: 'docker' | 'binary';
  runInBackground?: boolean; // default to true
  dataPath?: string; // defaults to NiceNode app route
  rpcTranslation?: string;
  // todo: define a standard for translating rpc calls for common node data
  //  which NiceNode uses to show the state of the node.
  //  (ex. peers, syncing, latest block num, etc.)
  iconUrl?: string;
  category?: string;
};

export type DockerOptions = NodeOptions & {
  executionType: 'docker';
  imageName: string; // todo: support multi-image node
  // todo: support non-docker hub
  containerIds?: string[];
};

/**
 * @param downloadUrl binary must end in .tar.gz or .zip
 */
export type BinaryOptions = NodeOptions & {
  executionType: 'binary';
  downloadUrl: string;
  // todo: could be file path
};

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

type Node = NodeOptions & {
  id: NodeId;
  status: NodeStatus;
  lastStarted?: string;
  lastStopped?: string;
};

export type DockerNode = Node & DockerOptions;

export type BinaryNode = Node & BinaryOptions;

export const isDockerNode = (node: Node) => node.executionType === 'docker';
export const isBinaryNode = (node: Node) => node.executionType === 'binary';

export const createNode = (opts: NodeOptions): Node => {
  const node: Node = {
    ...opts,
    id: uuidv4(),
    status: NodeStatus.created,
  };
  return node;
};
export default Node;
