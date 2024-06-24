import { Modal } from '../../Generics/redesign/Modal/Modal';
import electron from '../../electronGlobal';
import CartridgeUpdate from '../CartridgeUpdate/CartridgeUpdate.js';
import { modalRoutes } from './modalUtils';

type Props = {
  modalOnClose: () => void;
};

export const CartridgeUpdateModal = ({ modalOnClose }: Props) => {
  const buttonSaveLabel = 'I Understand';

  const modalOnSaveConfig = async () => {
    // await electron.getSetHasSeenAlphaModal(true);
    console.log('close update changes!');
    modalOnClose();
  };

  return (
    <Modal
      route={modalRoutes.cartridgeUpdate}
      modalType="info"
      backButtonEnabled={false}
      buttonSaveLabel={buttonSaveLabel}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <CartridgeUpdate />
    </Modal>
  );
};
