import electron from '../../electronGlobal';
import UpdatePodman from '../UpdatePodman/UpdatePodman';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalRoutes } from './modalUtils';

type Props = {
  modalOnClose: () => void;
};

export const AlphaBuildModal = ({ modalOnClose }: Props) => {
  const buttonSaveLabel = 'I Understand';

  const modalOnSaveConfig = async () => {
    await electron.getSetHasSeenAlphaModal(true);
    console.log('save!');
    modalOnClose();
  };

  return (
    <Modal
      route={modalRoutes.updatePodman}
      modalType="info"
      backButtonEnabled={false}
      buttonSaveLabel={buttonSaveLabel}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <UpdatePodman />
    </Modal>
  );
};
