import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setModalState } from '../../state/modal';
import electron from '../../electronGlobal';
import { useAppDispatch } from '../../state/hooks';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';
import ResetConfigWrapper from '../ResetConfigModal/ResetConfigWrapper';

type Props = {
  modalOnClose: () => void;
};

export const ResetConfigModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const modalTitle = t('ResetNodeSettingsQuestion');
  const buttonSaveLabel = t('ResetNodeSettingsModal');
  const buttonSaveType = 'danger';

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const { selectedNode } = updatedConfig || (modalConfig as ModalConfig);

    try {
      if (selectedNode) {
        electron.resetNodeConfig(selectedNode.id);
      }
    } catch (err) {
      console.error(err);
      throw new Error(
        'There was an error resetting config to default. Try again and please report the error to the NiceNode team in Discord.',
      );
    }
    modalOnClose();
  };

  const onCancel = () => {
    dispatch(
      setModalState({
        isModalOpen: true,
        screen: { route: 'nodeSettings', type: 'modal' },
      }),
    );
  };

  return (
    <Modal
      modalTitle={modalTitle}
      modalType="alert"
      buttonSaveLabel={buttonSaveLabel}
      buttonSaveType={buttonSaveType}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
      modalOnCancel={onCancel}
    >
      <ResetConfigWrapper
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig,
          );
        }}
      />
    </Modal>
  );
};
