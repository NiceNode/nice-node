import { useState } from 'react';
import RemoveNodeWrapper from 'renderer/Presentational/RemoveNodeModal/RemoveNodeWrapper';
import electron from 'renderer/electronGlobal';
import { useAppDispatch } from 'renderer/state/hooks';
import { setModalState } from 'renderer/state/modal';
import { Modal } from './Modal';
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
        'There was an error removing the node. Try again and please report the error to the NiceNode team in Discord.'
      );
    }
    modalOnClose();
  };

  const onCancel = () => {
    dispatch(
      setModalState({
        isModalOpen: true,
        screen: { route: 'nodeSettings', type: 'modal' },
      })
    );
  };

  return (
    <Modal
      modalTitle={modalTitle}
      modalType="alert"
      buttonSaveLabel={buttonSaveLabel}
      buttonSaveType={buttonSaveType}
      modalOnSaveConfig={modalOnSaveConfig}
      modalOnClose={onCancel}
    >
      <RemoveNodeWrapper
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig
          );
        }}
      />
    </Modal>
  );
};
