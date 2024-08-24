import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../Generics/redesign/Modal/Modal.js';
import electron from '../../electronGlobal.js';
import { reportEvent } from '../../events/reportEvent.js';
import UpdateWrapper from '../UpdateModal/UpdateWrapper.js';
import { type ModalConfig, modalOnChangeConfig } from './modalUtils.js';
import { modalRoutes } from './modalUtils.js';

type Props = {
  modalOnClose: () => void;
  data: any;
};

export const UpdateModal = ({ modalOnClose, data }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const { t } = useTranslation();

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
        deeplink={data?.deeplink}
        modalOnClose={modalOnClose}
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
