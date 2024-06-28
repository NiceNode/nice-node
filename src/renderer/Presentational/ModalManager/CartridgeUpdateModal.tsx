import { useState } from 'react';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import CartridgeUpdate from '../CartridgeUpdate/CartridgeUpdate.js';
import { modalRoutes } from './modalUtils';
import { type ModalConfig, modalOnChangeConfig } from './modalUtils';

type Props = {
  modalOnClose: () => void;
};

export const CartridgeUpdateModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});

  const buttonSaveLabel = 'Close';

  const modalOnSaveConfig = async () => {
    console.log('close update changes!');
    modalOnClose();
  };

  return (
    <Modal
      route={modalRoutes.cartridgeUpdate}
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
      <CartridgeUpdate
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
