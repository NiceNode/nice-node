import { useState } from 'react';
import { Modal } from '../../Generics/redesign/Modal/Modal.js';
import ControllerUpdate from '../ControllerUpdate/ControllerUpdate.js';
import { modalRoutes } from './modalUtils.js';
import { type ModalConfig, modalOnChangeConfig } from './modalUtils.js';

type Props = {
  modalOnClose: () => void;
};

export const ControllerUpdateModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});

  const buttonSaveLabel = 'Close';

  const modalOnSaveConfig = async () => {
    console.log('close update changes!');
    modalOnClose();
  };

  return (
    <Modal
      route={modalRoutes.controllerUpdate}
      modalTitle={'Update Changes'}
      modalType="modal"
      modalStyle="controllerUpdate" // adds scrolling to the modal content
      backButtonEnabled={false}
      buttonSaveLabel={buttonSaveLabel}
      modalOnSaveConfig={modalOnSaveConfig}
      buttonSaveType="secondary"
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <ControllerUpdate
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
