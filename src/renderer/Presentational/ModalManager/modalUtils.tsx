import React from 'react';
import Node from 'common/node';
import { ThemeSetting } from 'main/state/settings';

export interface ModalConfig {
  node?: string;
  executionClient?: string;
  consensusClient?: string;
  storageLocation?: string;
  theme?: ThemeSetting;
  language?: string;
  isOpenOnStartup?: boolean;
  isNotificationsEnabled?: boolean;
  isEventReportingEnabled?: boolean;
  selectedNode?: Node;
  isDeleteStorage?: boolean;
  settingsConfig?: object;
  newDataDir?: string;
  // eslint-disable-next-line
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
  failSystemRequirements: 'failSystemRequirements',
  alphaBuild: 'alphaBuild',
});

/* Use this to change config settings, saved temporarily in the modal file with backend apis until it's saved by modalOnSaveConfig
You can also pass in a save flag to update the config immediately with the temporarily saved config settings
This should always be called in the XXModal.tsx file due to needing access to setModalConfig, and current modalConfig, and passed into appropriate Wrapper file */
export const modalOnChangeConfig = async (
  config: ModalConfig,
  modalConfig: ModalConfig,
  setModalConfig: React.Dispatch<React.SetStateAction<ModalConfig>>,
  save?: boolean,
  modalOnSaveConfig?: (newConfig: ModalConfig) => Promise<void>,
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
  console.log(
    'modalOnChangeConfig: config, modalConfig, updatedConfig',
    config,
    modalConfig,
    updatedConfig,
  );
  setModalConfig(updatedConfig);

  if (save && modalOnSaveConfig) {
    await modalOnSaveConfig(updatedConfig);
  }
};
