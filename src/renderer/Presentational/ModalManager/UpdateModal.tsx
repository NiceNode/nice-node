import { Modal } from '../../Generics/redesign/Modal/Modal.js';
import UpdateWrapper from '../UpdateModal/UpdateWrapper.js';
import { type ModalConfig, modalOnChangeConfig } from './modalUtils.js';
import { modalRoutes } from './modalUtils.js';

type Props = {
  modalOnClose: () => void;
  data: any;
};

export const UpdateModal = ({ modalOnClose, data }: Props) => {
  const { deeplink, nodeOverview } = data;
  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    modalOnClose();
  };

  return (
    <Modal
      modalStyle={modalRoutes.update}
      route={modalRoutes.update}
      modalType="simple"
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={modalOnClose}
      modalOnCancel={modalOnClose}
    >
      <UpdateWrapper
        deeplink={deeplink}
        nodeOverview={nodeOverview}
        modalOnClose={modalOnClose}
      />
    </Modal>
  );
};
