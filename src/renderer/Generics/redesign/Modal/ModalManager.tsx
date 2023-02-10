import { useSelector } from 'react-redux';
import { useState } from 'react';
import electron from 'renderer/electronGlobal';
import { useAppDispatch } from 'renderer/state/hooks';
import { updateSelectedNodeId } from 'renderer/state/node';
import { getModalState } from '../../../state/modal';
import { Modal } from './Modal';
import { modalRoutes } from './modalRoutes';

const ModalManager = () => {
  const { isModalOpen, screen } = useSelector(getModalState);
  const [modalConfig, setModalConfig] = useState({});
  const dispatch = useAppDispatch();

  if (!isModalOpen) {
    return null;
  }

  const modalOnChangeConfig = (config: object) => {
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
  };

  const modalOnSaveConfig = async () => {
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
    } = modalConfig;

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
        if (config) {
          await electron.updateNode(selectedNode.id, {
            config,
          });
        }
        if (newDataDir) {
          await electron.updateNodeDataDir(selectedNode, newDataDir);
        }
        break;
      case modalRoutes.removeNode:
        try {
          await electron.removeNode(selectedNode.id, {
            isDeleteStorage,
          });
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
