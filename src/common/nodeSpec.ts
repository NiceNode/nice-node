import { SystemRequirements } from './systemRequirements';

import { ConfigValuesMap, ConfigTranslationMap } from './nodeConfig';
import { NiceNodeRpcTranslation } from './rpcTranslation';

/* eslint-disable max-classes-per-file */
export type ExecutionTypes = 'docker' | 'binary';
export type Architectures = 'amd64' | 'arm64';

// Create controls which output using translation.
//  (Ex. https://github.com/daffl/jquery.dform or https://medium.com/swlh/how-to-generate-dynamic-form-from-json-with-react-5d70386bb38b)
// node devs provide minimal translation
// how can they fallback on default?
//  provide some values, and optionally use rest of default values (spread operator)

type BaseNodeExecution = {
  executionTypes: ExecutionTypes[];
  defaultExecutionType?: ExecutionTypes;
  dataPath?: string; // defaults to NiceNode app route
  architectures?: { docker?: Architectures[]; binary?: Architectures[] };
  input?: {
    default?: string[];
    defaultConfig?: Record<string, any>;
  };
  dependencies?: any[]; // l1 full node w/ http rpc
  runInBackground?: boolean; // default to true
};

export type DockerExecution = BaseNodeExecution & {
  executionTypes: ['docker'];
  imageName: string; // todo: support multi-image node
  // todo: support non-docker hub
  // containerIds?: string[];
  input?: {
    defaultConfig?: ConfigValuesMap;
    default?: string[];
    docker?: {
      containerVolumePath: string;
      ports: {
        p2p: string[];
        rest: string;
        ws?: string;
        engine?: string;
      };
      raw?: string;
      forcedRawNodeInput?: string;
    };
  };
};

type ArchOptsMap = {
  amd64?: string;
  amd32?: string;
  arm64?: string;
  arm7?: string;
};
// enum ArchOpts {
//   amd64 = 'amd64',
//   amd32 = 'amd32',
// }

export type BinaryDownload = {
  type: 'static' | 'githubReleases';
  darwin?: ArchOptsMap;
  linux?: ArchOptsMap;
  windows?: ArchOptsMap;
  latestVersionUrl?: string;
  excludeNameWith?: string;
  responseFormat?: 'githubReleases';
};
/**
 * @param downloadUrl binary must end in .tar.gz or .zip
 */
export type BinaryExecution = BaseNodeExecution & {
  executionTypes: ['binary'];
  downloadUrl: string;
  execPath: string; // ex. geth
  input: {
    default?: string[];
  };
  binaryDownload: BinaryDownload;
  // todo: could be file path
};

export type NodeExecution =
  | DockerExecution
  | BinaryExecution
  | BaseNodeExecution;

/**
 * @param dataPath where the node's data will be stored
 */
export type NodeSpecification = {
  specId: string;
  version: string;
  displayName: string;
  execution: NodeExecution;
  systemRequirements?: SystemRequirements;
  rpcTranslation?: NiceNodeRpcTranslation;
  configTranslation?: ConfigTranslationMap;
  nodeReleasePhase?: 'alpha' | 'beta';
  // rpcTranslation?: NiceNodeRpcTranslation;
  // todo: define a standard for translating rpc calls for common node data
  //  which NiceNode uses to show the state of the node.
  //  (ex. peers, syncing, latest block num, etc.)
  iconUrl?: string;
  category?: string;
  documentation?: { default?: string; docker?: string; binary?: string };
};
