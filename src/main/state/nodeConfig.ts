// eslint-disable-next-line import/no-cycle
import { gethDataDir } from '../files';
import logger from '../logger';
import store from './store';

export type NodeConfig = {
  http?: boolean;
  httpAllowedDomains?: string[];
  dataDirectory?: string;
  useDirectInput?: boolean;
  directInputConfig?: string[];
  asCliInput?: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSavedNodeConfig = (node: string): any => {
  return store.get(`${node}.nodeConfig`);
};

// function from NodeConfig to node specific CLI input flags
export const nodeConfigToCliInput = (
  node: string,
  config: NodeConfig
): string[] => {
  const cliInput = [];
  if (node === 'geth') {
    if (config.http) {
      cliInput.push('--http');
    }
    if (config.httpAllowedDomains) {
      cliInput.push('--http.corsdomain');
      cliInput.push(config.httpAllowedDomains.join(','));
    }
    if (config.dataDirectory) {
      cliInput.push('--datadir');
      cliInput.push(config.dataDirectory);
    }
  } else {
    logger.error(`Unknown config to CLI input for node ${node}.`);
  }
  return cliInput;
};

export const getDefaultNodeConfig = (node: string) => {
  const gethDataPath = gethDataDir();
  const defaultConfig: NodeConfig = {
    http: true,
    httpAllowedDomains: ['nice-node://'],
    dataDirectory: gethDataPath,
  };
  defaultConfig.asCliInput = nodeConfigToCliInput(node, defaultConfig);
  console.log('getDefaultNodeConfig', node, defaultConfig);
  return defaultConfig;
};

// function to apply operations NodeConfig
export const getNodeConfig = (node: string) => {
  console.log('getNodeConfig: ', node);
  let nodeConfig: NodeConfig = getSavedNodeConfig(node);
  if (nodeConfig === undefined) {
    nodeConfig = getDefaultNodeConfig(node);
  }
  return nodeConfig;
};

export const getNodeConfigAsCliInput = (node: string): string[] => {
  const nodeConfig = getNodeConfig(node);
  const cliInput = nodeConfig.asCliInput ? nodeConfig.asCliInput : [];
  return cliInput;
};

export const saveNodeConfig = (node: string, nodeConfig: NodeConfig): void => {
  console.log(`store.set(${node}.nodeConfig`, nodeConfig);
  store.set(`${node}.nodeConfig`, nodeConfig);
};

/**
 * Set node's config to default NiceNode compatible config
 */
export const setToDefaultNodeConfig = async (node: string) => {
  const defaultConfig = getDefaultNodeConfig(node);
  await saveNodeConfig(node, defaultConfig);
};

/**
 * function from node specific CLI input flags to NodeConfig (raw user input)
 */
export const setDirectInputNodeConfig = async (
  node: string,
  directInput: string[]
) => {
  const nodeConfig: NodeConfig = {
    useDirectInput: true,
    directInputConfig: directInput,
    asCliInput: directInput,
  };
  // todo: parse out config key & values from direct input
  await saveNodeConfig(node, nodeConfig);
};

export const changeNodeConfig = (node: string, configChange: NodeConfig) => {
  const nodeConfig: NodeConfig = getNodeConfig(node);
  nodeConfig.useDirectInput = false;
  // Delete directInput if it should be overwritten when controls are used
  // delete nodeConfig.directInputConfig;
  Object.entries(configChange).forEach(([configKey, configValue]) => {
    console.log([configKey, configValue]);
    const nodeConfigKey = configKey as keyof NodeConfig;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeConfig[nodeConfigKey] = configValue as any;
  });
  nodeConfig.asCliInput = nodeConfigToCliInput(node, nodeConfig);
  saveNodeConfig(node, nodeConfig);
};
