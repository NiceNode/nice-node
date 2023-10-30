import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import electron from '../../electronGlobal';
import RemoveNodeWrapper from '../RemoveNodeModal/RemoveNodeWrapper';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';
import { reportEvent } from '../../events/reportEvent';

type Props = {
  modalOnClose: () => void;
};

export const RemoveNodeModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const [sIsRemoving, setIsRemoving] = useState<boolean>(false);
  const { t } = useTranslation();
  const modalTitle = t('ResetNodeSettingsQuestion');
  const buttonSaveLabel = t('RemoveNode');
  const buttonRemovingLabel = t('RemovingNode');
  const buttonSaveType = 'danger';

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const { selectedNodePackage, isDeleteStorage = true } =
      updatedConfig || (modalConfig as ModalConfig);

    try {
      if (selectedNodePackage) {
        setIsRemoving(true);
        await electron.removeNodePackage(selectedNodePackage.id, {
          isDeleteStorage,
        });
        console.log('removeNode package: ', selectedNodePackage);
        reportEvent('RemoveNodePackage', {
          nodePackage: selectedNodePackage.spec.specId,
          clients: selectedNodePackage.services.map(
            (service) => service.node.spec.specId,
          ),
        });
      }
    } catch (err) {
      console.error(err);
      throw new Error(
        'There was an error removing the node. Try again and please report the error to the NiceNode team in Discord.',
      );
    }
    modalOnClose();
  };

  return (
    <Modal
      modalTitle={modalTitle}
      modalType="alert"
      buttonSaveLabel={sIsRemoving ? buttonRemovingLabel : buttonSaveLabel}
      buttonSaveType={buttonSaveType}
      isSaveButtonDisabled={sIsRemoving}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <RemoveNodeWrapper
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
