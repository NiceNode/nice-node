/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';

export type ExecutionTypes = 'docker' | 'binary';
export type Architectures = 'amd64' | 'arm64';
// export type RpcTranslation = eth1_openapi_spec

// node devs provide minimal translation
// how can they fallback on default?
//  provide some values, and optionally use rest of default values (spread operator)
export type SelectControl = { value: 'string'; config: string[] | undefined };
export type ConfigTranslationControl = {
  displayName: string;
  defaultValue: string;
  translation:
    | { value: 'string'; config: string[] | undefined }[]
    | {
        type: 'text/ipAddress';
        default: '0.0.0.0';
        config: ['--JsonRpc.Host'];
      };
};
export type ConfigTranslation = {
  // set http
  http?: ConfigTranslationControl;
};
export type DefaultConfigTranslation = {
  // set http
  http: {
    displayName: 'Enable HTTP-RPC Server';
    defaultValue: 'Enable';
    translation: [
      {
        value: 'Enable';
        config: ['--http']; // geth, ligthouse
      },
      {
        value: 'Disable';
        config: [];
      }
    ];
  };
};
export type ConfigTranslationEx = {
  // set http
  http: {
    displayName: 'Enable HTTP-RPC Server';
    defaultValue: 'Enable';
    translation: [
      {
        value: 'Enable';
        config: ['--JsonRpc.Enabled', 'true']; // nethermind
        // config: ['--http']; // lighthouse
        // config: ['--http']; // geth
      },
      {
        value: 'Disable';
        config: [];
      }
    ];
  };
  httpAddress: {
    displayName: 'HTTP-RPC server listening interface';
    type: 'text/ipAddress';
    default: '0.0.0.0';
    config: ['--JsonRpc.Host']; // nethermind
    // config: ['--http-address']; // lighthouse
    // config: ['--http']; // geth
  };
  network: // | {
  //     values: ['mainnet', 'goerli', 'ropsten'];
  //     default: 'mainnet';
  //     config: ['--network']; //lighthouse
  //   }
  // |
  {
    displayName: 'Ethereum network';
    defaultValue: 'mainnet';
    translation: [
      //geth
      {
        value: 'mainnet';
        config: ['--mainnet'];
      },
      {
        value: 'kiln';
        config: ['--kiln'];
      },
      {
        value: 'goerli';
        config: ['--goerli'];
      }
    ];
  };
  syncMode: {
    displayName: 'Node sync mode';
    defaultValue: 'snap';
    translation: [
      //geth
      {
        value: 'snap';
        config: ['--syncmode', 'snap'];
      },
      {
        value: 'fast';
        config: ['--syncmode', 'fast'];
      },
      {
        value: 'light';
        config: ['--syncmode', 'light'];
      }
    ];
  };
  httpApis: {
    displayName: "API's offered over the HTTP-RPC interface";
    defaultValue: 'eth,web3,net';
    type: 'select/multi';
    join: ',';
    config: ['--http.api'];
    translation: [
      //geth
      {
        value: 'eth';
        config: 'eth';
      },
      {
        value: 'web3';
        config: 'web3';
      },
      {
        value: 'net';
        config: 'net';
      },
      {
        value: 'admin';
        config: 'admin';
      },
      {
        value: 'net';
        config: 'net';
      }
    ];
  };
  // set http port
  // get peers
  //
};
export type NodeId = string;
export type NodeExecution = {
  executionTypes: ExecutionTypes[];
  dataPath?: string; // defaults to NiceNode app route
  architectures?: { docker?: Architectures[]; binary?: Architectures[] };
};

/**
 * @param dataPath where the node's data will be stored
 */
export type NodeSpecification = {
  displayName: string;
  execution: NodeExecution;
  runInBackground?: boolean; // default to true
  rpcTranslation?: string;
  // todo: define a standard for translating rpc calls for common node data
  //  which NiceNode uses to show the state of the node.
  //  (ex. peers, syncing, latest block num, etc.)
  iconUrl?: string;
  category?: string;
  input?: { default?: string[] };
  documentation?: { default?: string; docker?: string; binary?: string };
};

export type DockerOptions = NodeSpecification & {
  executionType: 'docker';
  imageName: string; // todo: support multi-image node
  // todo: support non-docker hub
  containerIds?: string[];
};

/**
 * @param downloadUrl binary must end in .tar.gz or .zip
 */
export type BinaryOptions = NodeSpecification & {
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

type Node = {
  id: NodeId;
  spec: NodeSpecification;
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
