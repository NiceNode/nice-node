import { useState, useCallback } from 'react';
import AddNodeStepperModal from 'renderer/Presentational/AddNodeStepper/AddNodeStepperModal';
import electron from 'renderer/electronGlobal';
import { useAppDispatch } from 'renderer/state/hooks';
import { updateSelectedNodeId } from 'renderer/state/node';
import { Modal } from './Modal';
import { ModalConfig } from './ModalManager';

type Props = {
  modalOnClose: () => void;
};

export const AddNodeModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState({});
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [step, setStep] = useState(0);
  const dispatch = useAppDispatch();

  const modalTitle =
    step === 0 ? 'Launch an Ethereum Node' : 'Docker Installation';

  const buttonSaveLabel = step === 0 ? 'Next' : 'Done';
  const buttonCancelLabel = step === 0 ? 'Cancel' : 'Back';

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const {
      executionClient = 'besu',
      consensusClient = 'nimbus',
      storageLocation,
      nodeLibrary,
    } = updatedConfig || (modalConfig as ModalConfig);

    let ecNodeSpec;
    let ccNodeSpec;
    if (nodeLibrary) {
      ecNodeSpec = nodeLibrary?.[executionClient];
      ccNodeSpec = nodeLibrary?.[`${consensusClient}-beacon`];
    }

    if (!ecNodeSpec || !ccNodeSpec) {
      throw new Error('ecNodeSpec or ccNodeSpec is undefined');
    }

    // eslint-disable-next-line no-case-declarations
    const { ecNode, ccNode } = await electron.addEthereumNode(
      ecNodeSpec,
      ccNodeSpec,
      { storageLocation }
    );

    dispatch(updateSelectedNodeId(ecNode.id));
    await electron.startNode(ecNode.id);
    await electron.startNode(ccNode.id);
  };

  const modalOnChangeConfig = async (config: ModalConfig, save?: boolean) => {
    let updatedConfig = {};
    const keys = Object.keys(config);
    if (keys.length > 1) {
      updatedConfig = {
        ...modalConfig,
        ...config,
      };
    } else {
      const key = keys[0];
      updatedConfig = {
        ...modalConfig,
        [key]: config[key],
      };
    }
    setModalConfig(updatedConfig);
    if (save) {
      await modalOnSaveConfig(updatedConfig);
    }
  };

  const disableSaveButton = useCallback((value: boolean) => {
    setIsSaveButtonDisabled(value);
  }, []);

  const onCancel = () => {
    if (step === 0) {
      modalOnClose();
    } else {
      setStep(0);
    }
  };

  const onSave = () => {
    if (step === 0) {
      setStep(1);
    } else {
      modalOnSaveConfig(undefined);
      modalOnClose();
    }
  };

  return (
    <Modal
      modalTitle={modalTitle}
      modalStyle="addNode"
      buttonSaveLabel={buttonSaveLabel}
      buttonCancelLabel={buttonCancelLabel}
      modalOnSaveConfig={onSave}
      modalOnClose={onCancel}
      isSaveButtonDisabled={isSaveButtonDisabled}
    >
      <AddNodeStepperModal
        step={step}
        modal
        modalOnChangeConfig={modalOnChangeConfig}
        disableSaveButton={disableSaveButton}
      />
    </Modal>
  );
};
