import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import NodeSettingsWrapper from 'renderer/Presentational/NodeSettings/NodeSettingsWrapper';
import electron from 'renderer/electronGlobal';
import { Modal } from './Modal';
import { ModalConfig } from './ModalManager';

type Props = {
  modalOnClose: () => void;
};

export const NodeSettingsModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState({});
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const { t } = useTranslation('genericComponents');
  const modalTitle = t('NodeSettings');
  const buttonSaveLabel = 'Save changes';

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const { settingsConfig, selectedNode, newDataDir } =
      updatedConfig || (modalConfig as ModalConfig);

    if (settingsConfig && selectedNode) {
      await electron.updateNode(selectedNode.id, {
        config: settingsConfig,
      });
    }
    if (newDataDir && selectedNode) {
      await electron.updateNodeDataDir(selectedNode, newDataDir);
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

  const disableSaveButton = useCallback((value: boolean) => {
    setIsSaveButtonDisabled(value);
  }, []);

  return (
    <Modal
      modalTitle={modalTitle}
      modalStyle="nodeSettings"
      buttonSaveLabel={buttonSaveLabel}
      modalOnSaveConfig={() => {
        modalOnSaveConfig(undefined);
        modalOnClose();
      }}
      modalOnClose={modalOnClose}
      isSaveButtonDisabled={isSaveButtonDisabled}
    >
      <NodeSettingsWrapper
        modalOnChangeConfig={modalOnChangeConfig}
        disableSaveButton={disableSaveButton}
      />
    </Modal>
  );
};
