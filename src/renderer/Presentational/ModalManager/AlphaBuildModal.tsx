import electron from '../../electronGlobal';
import AlphaBuild from '../AlphaBuild/AlphaBuild';
import { Modal } from '../../Generics/redesign/Modal/Modal';

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
      modalType="info"
      backButtonEnabled={false}
      buttonSaveLabel={buttonSaveLabel}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <AlphaBuild />
    </Modal>
  );
};
