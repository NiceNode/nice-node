import { ThemeSetting } from 'main/state/settings';
import React from 'react';
import Node from 'common/node';

export interface ModalConfig {
  executionClient?: string;
  consensusClient?: string;
  storageLocation?: string;
  theme?: ThemeSetting;
  isOpenOnStartup?: boolean;
  isNotificationsEnabled?: boolean;
  isEventReportingEnabled?: boolean;
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
  failSystemRequirements: 'failSystemRequirements',
});

/* Use this to change config settings, saved temporarily in the modal file with backend apis until it's saved by modalOnSaveConfig
You can also pass in a save flag to update the config immediately with the temporarily saved config settings
This should always be called in the XXModal.tsx file due to needing access to setModalConfig, and current modalConfig, and passed into appropriate Wrapper file */
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
