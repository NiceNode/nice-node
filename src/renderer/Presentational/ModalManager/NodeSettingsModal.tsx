import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import electron from '../../electronGlobal';
import NodeSettingsWrapper from '../NodeSettings/NodeSettingsWrapper';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';

type Props = {
  option?: string;
  modalOnClose: () => void;
};

export const NodeSettingsModal = ({
  option = undefined,
  modalOnClose,
}: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const { t } = useTranslation();
  const modalTitle = t('NodeSettings');
  const buttonSaveLabel = t('SaveChanges');

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
      modalOnCancel={modalOnClose}
      isSaveButtonDisabled={isSaveButtonDisabled}
    >
      <NodeSettingsWrapper
        option={option}
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig,
          );
        }}
        disableSaveButton={disableSaveButton}
      />
    </Modal>
  );
};
