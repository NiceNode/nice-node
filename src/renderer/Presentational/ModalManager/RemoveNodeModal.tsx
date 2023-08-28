import { useState } from 'react';
import { setModalState } from '../../state/modal';
import electron from '../../electronGlobal';
import { useAppDispatch } from '../../state/hooks';
import RemoveNodeWrapper from '../RemoveNodeModal/RemoveNodeWrapper';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';

type Props = {
  modalOnClose: () => void;
};

export const RemoveNodeModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const dispatch = useAppDispatch();
  const modalTitle = 'Are you sure you want to remove this node?';
  const buttonSaveLabel = 'Remove node';
  const buttonSaveType = 'danger';

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const { selectedNode, isDeleteStorage = true } =
      updatedConfig || (modalConfig as ModalConfig);

    try {
      if (selectedNode) {
        await electron.removeNode(selectedNode.id, {
          isDeleteStorage,
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
      buttonSaveLabel={buttonSaveLabel}
      buttonSaveType={buttonSaveType}
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
