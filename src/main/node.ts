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
};

export type DockerOptions = NodeOptions & {
  executionType: 'docker';
  imageName: string; // todo: support multi-image node
  // todo: support non-docker hub
};

/**
 * @param downloadUrl binary must end in .tar.gz or .zip
 */
export type BinaryOptions = {
  executionType: 'binary';
  downloadUrl: string;
  // todo: could be file path
};

export default class Node {
  id: NodeId;
  displayName: string;
  executionType: 'docker' | 'binary';
  runInBackground?: boolean; // default to true
  dataPath?: string; // defaults to NiceNode app route
  rpcTranslation?: string; // eth EL, eth CL, custom. defaults to eth EL
  iconUrl?: string;

  constructor(opts: NodeOptions) {
    this.id = uuidv4();
    this.executionType = opts.executionType;
    this.displayName = opts.displayName;
    this.iconUrl = opts.iconUrl;
  }

  // start() {
  //   console.log(`start ${this.executionType} node`);
  // }

  // stop() {
  //   console.log(`stop ${this.executionType} node`);
  // }
}

// export class DockerNode {
//   id: NodeId;
//   displayName: string;
//   executionType: 'docker' | 'binary';
//   runInBackground?: boolean; // default to true
//   dataPath?: string; // defaults to NiceNode app route
//   rpcTranslation?: string;
//   imageName?: string; // todo: support multi-image node
//   downloadUrl?: string;

//   constructor({ executionType, displayName }: NodeOptions) {
//     super();
//     this.id = uuidv4();
//     this.executionType = executionType;
//     this.displayName = displayName;
//   }

//   start() {
//     console.log(`start ${this.executionType} node`);
//   }

//   stop() {
//     console.log(`stop ${this.executionType} node`);
//   }
// }
