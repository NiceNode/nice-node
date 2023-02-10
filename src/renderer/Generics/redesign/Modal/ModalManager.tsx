import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
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
    // move this into a redux reducer?
    const {
      executionClient,
      consensusClient,
      storageLocation,
      nodeLibrary,
      theme,
      isOpenOnStartup,
      config,
      selectedNode,
      newDataDir,
    } = modalConfig;

    let execution;
    let consensus;
    let ecNodeSpec;
    let ccNodeSpec;
    switch (screen.route) {
      case modalRoutes.addNode:
        execution = executionClient || 'besu';
        consensus = consensusClient || 'nimbus';

        if (nodeLibrary) {
          ecNodeSpec = nodeLibrary?.[execution];
          ccNodeSpec = nodeLibrary?.[`${consensus}-beacon`];
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
