import { useSelector } from 'react-redux';
import { useState } from 'react';
import { ThemeSetting } from 'main/state/settings';
import Node from 'common/node';
import electron from '../../../electronGlobal';
import { updateSelectedNodeId } from '../../../state/node';
import { useAppDispatch } from '../../../state/hooks';
import { getModalState } from '../../../state/modal';
import { Modal } from './Modal';
import { modalRoutes } from './modalRoutes';

export type ModalConfig = {
  executionClient?: string;
  consensusClient?: string;
  storageLocation?: string;
  theme?: ThemeSetting;
  isOpenOnStartup?: boolean;
  selectedNode?: Node;
  isDeleteStorage?: boolean;
  config?: object;
  newDataDir?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const ModalManager = () => {
  const { isModalOpen, screen } = useSelector(getModalState);
  const [modalConfig, setModalConfig] = useState({});
  const dispatch = useAppDispatch();

  if (!isModalOpen) {
    return null;
  }

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    // TODO: move this into a redux reducer?
    // TODO: add error handling for electron failures
    const {
      executionClient = 'besu',
      consensusClient = 'nimbus',
      storageLocation,
      nodeLibrary,
      theme,
      isOpenOnStartup,
      config,
      selectedNode,
      newDataDir,
      isDeleteStorage = true,
    } = updatedConfig || (modalConfig as ModalConfig);

    let ecNodeSpec;
    let ccNodeSpec;
    switch (screen.route) {
      case modalRoutes.addNode:
        if (nodeLibrary) {
          ecNodeSpec = nodeLibrary?.[executionClient];
          ccNodeSpec = nodeLibrary?.[`${consensusClient}-beacon`];
        }

        if (!ecNodeSpec || !ccNodeSpec) {
          throw new Error('ecNodeSpec or ccNodeSpec is undefined');
        }

        // eslint-disable-next-line no-case-declarations
        const { ecNode, ccNode } = await electron.addEthereumNode(
          ecNodeSpec,
          ccNodeSpec,
          { storageLocation }
        );

        dispatch(updateSelectedNodeId(ecNode.id));
        await electron.startNode(ecNode.id);
        await electron.startNode(ccNode.id);
        break;
      case modalRoutes.preferences:
        if (theme) {
          await electron.setThemeSetting(theme);
        }
        if (isOpenOnStartup) {
          await electron.setIsOpenOnStartup(isOpenOnStartup);
        }
        break;
      case modalRoutes.nodeSettings:
        if (config && selectedNode) {
          await electron.updateNode(selectedNode.id, {
            config,
          });
        }
        if (newDataDir && selectedNode) {
          await electron.updateNodeDataDir(selectedNode, newDataDir);
        }
        break;
      case modalRoutes.removeNode:
        try {
          if (selectedNode) {
            await electron.removeNode(selectedNode.id, {
              isDeleteStorage,
            });
          }
        } catch (err) {
          console.error(err);
          throw new Error(
            'There was an error removing the node. Try again and please report the error to the NiceNode team in Discord.'
          );
        }
        break;
      default:
    }
  };

  const modalOnChangeConfig = async (config: ModalConfig, save?: boolean) => {
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
    if (save) {
      await modalOnSaveConfig(updatedConfig);
    }
  };

  return (
    <Modal
      modalOnClose={() => {
        setModalConfig({});
      }}
      modalOnChangeConfig={modalOnChangeConfig}
      modalOnSaveConfig={modalOnSaveConfig}
      screen={screen}
    />
  );
};

export default ModalManager;
