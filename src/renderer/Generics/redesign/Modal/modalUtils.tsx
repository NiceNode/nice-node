import { ThemeSetting } from 'main/state/settings';
import React from 'react';
import Node from 'common/node';

export interface ModalConfig {
  executionClient?: string;
  consensusClient?: string;
  storageLocation?: string;
  theme?: ThemeSetting;
  isOpenOnStartup?: boolean;
  selectedNode?: Node;
  isDeleteStorage?: boolean;
  settingsConfig?: object;
  newDataDir?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const modalRoutes = Object.freeze({
  addNode: 'addNode',
  nodeSettings: 'nodeSettings',
  preferences: 'preferences',
  addValidator: 'addValidator',
  clientVersions: 'clientVersions',
  stopNode: 'stopNode',
  removeNode: 'removeNode',
  updateUnavailable: 'updateUnavailable',
});

export const modalOnChangeConfig = async (
  config: ModalConfig,
  modalConfig: ModalConfig,
  setModalConfig: React.Dispatch<React.SetStateAction<ModalConfig>>,
  save?: boolean,
  modalOnSaveConfig?: (config: ModalConfig) => Promise<void>
) => {
  if (!setModalConfig || !modalConfig) {
    throw new Error('modal config is not defined');
  }

  let updatedConfig = {};
  const keys = Object.keys(config);
  if (keys.length > 1) {
    updatedConfig = {
      ...modalConfig,
      ...config,
    };
  } else {
    const key = keys[0];
    updatedConfig = {
      ...modalConfig,
      [key]: config[key],
    };
  }
  setModalConfig(updatedConfig);

  if (save && modalOnSaveConfig) {
    await modalOnSaveConfig(updatedConfig);
  }
};
