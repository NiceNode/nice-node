import { useSelector } from 'react-redux';
import { useState } from 'react';
import electron from 'renderer/electronGlobal';
import { getModalState } from '../../../state/modal';
import { Modal } from './Modal';

const ModalManager = () => {
  const { isModalOpen, screen } = useSelector(getModalState);
  const [modalConfig, setModalConfig] = useState({});

  if (!isModalOpen) {
    return null;
  }

  const modalOnChangeConfig = (configObject: object) => {
    let updatedObject = {};
    if (Object.keys(configObject).length > 1) {
      updatedObject = {
        ...modalConfig,
        ...configObject,
      };
    } else {
      const key = Object.keys(configObject)[0];
      updatedObject = {
        ...modalConfig,
        [key]: configObject[key],
      };
    }
    setModalConfig(updatedObject);
  };

  const modalOnSaveConfig = async () => {
    // move this into a redux reducer?
    // save route consts in a separate file
    switch (screen.route) {
      case 'preferences':
        // eslint-disable-next-line no-case-declarations
        const { theme, isOpenOnStartup } = modalConfig;
        if (theme) {
          await electron.setThemeSetting(theme);
        }
        if (isOpenOnStartup) {
          await electron.setIsOpenOnStartup(isOpenOnStartup);
        }
        break;
      case 'nodeSettings':
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
      modalOnChangeConfig={modalOnChangeConfig}
      modalOnSaveConfig={modalOnSaveConfig}
      screen={screen}
    />
  );
};

export default ModalManager;
