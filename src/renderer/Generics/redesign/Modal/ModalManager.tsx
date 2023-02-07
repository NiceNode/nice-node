import { useSelector } from 'react-redux';
import { useAppDispatch } from 'renderer/state/hooks';
import AddNodeStepper from 'renderer/Presentational/AddNodeStepper/AddNodeStepper';
import PreferencesWrapper from 'renderer/Presentational/Preferences/PreferencesWrapper';
import { useTranslation } from 'react-i18next';
import NodeSettingsWrapper from 'renderer/Presentational/NodeSettings/NodeSettingsWrapper';
import RemoveNodeWrapper, {
  RemoveNodeAction,
} from 'renderer/Presentational/RemoveNodeModal/RemoveNodeWrapper';
import { useState } from 'react';
import electron from 'renderer/electronGlobal';
import { getModalState, setModalState } from '../../../state/modal';
import { Modal } from './Modal';

const ModalManager = () => {
  const dispatch = useAppDispatch();
  const { isModalOpen, screen } = useSelector(getModalState);
  const { t } = useTranslation('genericComponents');
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
        const { config, selectedNode, newNodeDataDir } = modalConfig;
        if (config) {
          await electron.updateNode(selectedNode.id, {
            config,
          });
        }
        if (newNodeDataDir) {
          await electron.updateNodeDataDir(selectedNode.id, newNodeDataDir);
        }
        break;
      default:
    }
  };

  const resetModal = () => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
        config: {},
      })
    );
  };

  let modalContent = <></>;
  let modalProps = {};
  // Render the appropriate screen based on the current `screen` value
  switch (screen.route) {
    // Modals
    case 'addNode':
      modalProps = { isFullScreen: true, title: '' };
      modalContent = (
        <AddNodeStepper
          modal
          onChange={(newValue: 'done' | 'cancel') => {
            if (newValue === 'done' || newValue === 'cancel') {
              resetModal();
            }
          }}
        />
      );
      break;
    case 'nodeSettings':
      modalProps = { title: t('NodeSettings'), type: 'tabs' };
      modalContent = (
        <NodeSettingsWrapper modalOnChangeConfig={modalOnChangeConfig} />
      );
      break;
    case 'preferences':
      modalProps = { title: t('Preferences') };
      modalContent = (
        <PreferencesWrapper modalOnChangeConfig={modalOnChangeConfig} />
      );
      break;
    case 'addValidator':
      modalContent = <>Add Validator</>;
      break;
    case 'clientVersions':
      modalContent = <>Client Versions</>;
      break;

    // Alerts
    case 'stopNode':
      modalContent = <>Stop Node</>;
      break;
    case 'removeNode':
      modalProps = { title: t('RemoveNode') };
      modalContent = (
        <RemoveNodeWrapper
          isOpen
          onClose={(action: RemoveNodeAction) => {
            if (action === 'remove') {
              resetModal();
            } else {
              dispatch(
                setModalState({
                  isModalOpen: true,
                  screen: { route: 'nodeSettings', type: 'modal' },
                  config: {},
                })
              );
            }
          }}
        />
      );
      break;
    case 'updateUnvailable':
      modalContent = <>Update unavailable</>;
      break;
    default:
  }

  return (
    <Modal
      {...modalProps}
      modalOnSaveConfig={modalOnSaveConfig}
      onClickCloseButton={() => resetModal()}
    >
      {modalContent}
    </Modal>
  );
};

export default ModalManager;
