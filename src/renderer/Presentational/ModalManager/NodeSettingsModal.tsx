import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import NodeSettingsWrapper from 'renderer/Presentational/NodeSettings/NodeSettingsWrapper';
import electron from 'renderer/electronGlobal';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';

type Props = {
  modalOnClose: () => void;
};

export const NodeSettingsModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
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
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig
          );
        }}
        disableSaveButton={disableSaveButton}
      />
    </Modal>
  );
};
