import type React from 'react';
import type Node from '../../../common/node';
import type { NodePackage } from '../../../common/node';
import type {
  NodeLibrary,
  NodePackageLibrary,
} from '../../../main/state/nodeLibrary';
import type { ThemeSetting } from '../../../main/state/settings';
import type { ClientSelections } from '../AddNodeConfiguration/AddNodeConfiguration';

export interface ModalConfig {
  node?: string;
  clientSelections?: ClientSelections;
  storageLocation?: string;
  theme?: ThemeSetting;
  language?: string;
  isOpenOnStartup?: boolean;
  isNotificationsEnabled?: boolean;
  isEventReportingEnabled?: boolean;
  selectedNode?: Node;
  selectedNodePackage?: NodePackage;
  isDeleteStorage?: boolean;
  settingsConfig?: object;
  newDataDir?: string;
  nodeLibrary?: NodeLibrary;
  nodePackageLibrary?: NodePackageLibrary;

  [key: string]: any;
}

export const modalRoutes = Object.freeze({
  addNode: 'addNode',
  nodeSettings: 'nodeSettings',
  preferences: 'preferences',
  addValidator: 'addValidator',
  clientVersions: 'clientVersions',
  controllerUpdate: 'controllerUpdate',
  stopNode: 'stopNode',
  removeNode: 'removeNode',
  resetConfig: 'resetConfig',
  updateUnavailable: 'updateUnavailable',
  failSystemRequirements: 'failSystemRequirements',
  alphaBuild: 'alphaBuild',
  updatePodman: 'updatePodman',
});

/* Use this to change config settings, saved temporarily in the modal file with backend apis until it's saved by modalOnSaveConfig
You can also pass in a save flag to update the config immediately with the temporarily saved config settings
This should always be called in the XXModal.tsx file due to needing access to setModalConfig, and current modalConfig, and passed into appropriate Wrapper file */
// Warning: Be careful with binding or closure when using this function in a component
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
  // const keys = Object.keys(config);
  // if (keys.length > 1) {
  updatedConfig = {
    ...modalConfig,
    ...config,
  };
  // what is this case for?
  // } else {
  //   const key = keys[0];
  //   updatedConfig = {
  //     ...modalConfig,
  //     [key]: config[key],
  //   };
  // }
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
