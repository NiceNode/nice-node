import { useSelector } from 'react-redux';
import { useState } from 'react';
import electron from 'renderer/electronGlobal';
import { getModalState } from '../../../state/modal';
import { Modal } from './Modal';
import { modalRoutes } from './modalRoutes';

const ModalManager = () => {
  const { isModalOpen, screen } = useSelector(getModalState);
  const [modalConfig, setModalConfig] = useState({});

  if (!isModalOpen) {
    return null;
  }

  const modalOnChangeConfig = (config: object) => {
    let updatedObject = {};
    const keys = Object.keys(config);
    if (keys.length > 1) {
      updatedObject = {
        ...modalConfig,
        ...config,
      };
    } else {
      const key = keys[0];
      updatedObject = {
        ...modalConfig,
        [key]: config[key],
      };
    }
    console.log('updatedObject', updatedObject);
    setModalConfig(updatedObject);
    console.log('onChange', modalConfig);
  };

  const modalOnSaveConfig = async () => {
    // move this into a redux reducer?
    // save route consts in a separate file
    switch (screen.route) {
      case modalRoutes.addNode:
        // eslint-disable-next-line no-case-declarations
        console.log('modalConfig', modalConfig);
        break;
      case modalRoutes.preferences:
        // eslint-disable-next-line no-case-declarations
        console.log('modalConfig', modalConfig);
        const { theme, isOpenOnStartup } = modalConfig;
        if (theme) {
          await electron.setThemeSetting(theme);
        }
        if (isOpenOnStartup) {
          await electron.setIsOpenOnStartup(isOpenOnStartup);
        }
        break;
      case modalRoutes.nodeSettings:
        const { config, selectedNode, newDataDir } = modalConfig;
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
