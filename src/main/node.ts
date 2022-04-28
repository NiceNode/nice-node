export type NodeOptions = {
  displayName: string;
  executionType: 'docker' | 'binary';
  runInBackground?: boolean; // default to true
  dataPath?: string; // defaults to NiceNode app route
  rpcTranslation?: string;
  // todo: define a standard for translating common node data
  //  which NiceNode uses to show the state of the node.
  //  (ex. peers, syncing, latest block num, etc.)
};

export type DockerOptions = NodeOptions & {
  executionType: 'docker';
  imageName: string; // todo: support multi-image node
  // todo: support non-docker hub
};

export type BinaryOptions = {
  executionType: 'binary';
  downloadUrl: string;
  // todo: could be file path
};

export default class Node {
  executionType: 'docker' | 'binary';

  constructor({ executionType }: NodeOptions) {
    this.executionType = executionType;
  }

  start() {
    console.log(`start ${this.executionType} node`);
  }

  stop() {
    console.log(`stop ${this.executionType} node`);
  }
}
