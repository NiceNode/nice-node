import { NiceNodeRpcTranslation } from './rpcTranslation';

/* eslint-disable max-classes-per-file */
export type ExecutionTypes = 'docker' | 'binary';
export type Architectures = 'amd64' | 'arm64';

// Create controls which output using translation.
//  (Ex. https://github.com/daffl/jquery.dform or https://medium.com/swlh/how-to-generate-dynamic-form-from-json-with-react-5d70386bb38b)
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
type BaseNodeExecution = {
  executionTypes: ExecutionTypes[];
  defaultExecutionType?: ExecutionTypes;
  dataPath?: string; // defaults to NiceNode app route
  architectures?: { docker?: Architectures[]; binary?: Architectures[] };
  input?: { default?: string[] };
  dependencies?: any[]; // l1 full node w/ http rpc
  runInBackground?: boolean; // default to true
};

export type DockerExecution = BaseNodeExecution & {
  executionTypes: ['docker'];
  imageName: string; // todo: support multi-image node
  // todo: support non-docker hub
  // containerIds?: string[];
  input?: {
    default?: string[];
    docker?: { containerVolumePath: string; raw: string };
  };
};

/**
 * @param downloadUrl binary must end in .tar.gz or .zip
 */
export type BinaryExecution = BaseNodeExecution & {
  executionTypes: ['binary'];
  downloadUrl: string;
  // todo: could be file path
};

export type NodeExecution = DockerExecution | BinaryExecution;

/**
 * @param dataPath where the node's data will be stored
 */
export type NodeSpecification = {
  specId: string;
  displayName: string;
  execution: NodeExecution;
  rpcTranslation?: NiceNodeRpcTranslation;
  // rpcTranslation?: NiceNodeRpcTranslation;
  // todo: define a standard for translating rpc calls for common node data
  //  which NiceNode uses to show the state of the node.
  //  (ex. peers, syncing, latest block num, etc.)
  iconUrl?: string;
  category?: string;
  documentation?: { default?: string; docker?: string; binary?: string };
};
