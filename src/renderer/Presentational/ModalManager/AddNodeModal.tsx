import { useState, useCallback, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import electron from '../../electronGlobal';
import { useAppDispatch } from '../../state/hooks';
import { updateSelectedNodeId } from '../../state/node';
import AddNodeStepperModal from '../AddNodeStepper/AddNodeStepperModal';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';
import { useGetIsPodmanRunningQuery } from '../../state/settingsService';
import { reportEvent } from '../../events/reportEvent';

type Props = {
  modalOnClose: () => void;
};

export const AddNodeModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
    useState<boolean>(false);
  const [sIsPodmanRunning, setIsPodmanRunning] = useState<boolean>(false);
  const [step, setStep] = useState(0);
  const { t } = useTranslation();
  const { t: g } = useTranslation('genericComponents');

  useEffect(() => {
    reportEvent('OpenAddNodeModal');
  }, []);

  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: 15000,
  });
  const isPodmanRunning = qIsPodmanRunning?.data;

  const dispatch = useAppDispatch();

  let modalTitle = '';
  switch (step) {
    case 0:
      modalTitle = t('LaunchAnEthereumNode');
      break;
    case 1:
      modalTitle = t('NodeRequirements');
      break;
    case 2:
      modalTitle = t('PodmanInstallation');
      break;
    default:
  }

  const startNode =
    (step === 1 || step === 2) && (isPodmanRunning || sIsPodmanRunning);
  const buttonSaveLabel = startNode ? t('StartNode') : t('Continue');
  const buttonCancelLabel = step === 0 ? g('Cancel') : t('Back');
  const buttonSaveVariant = startNode ? 'icon-left' : 'text';

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
      { storageLocation },
    );
    reportEvent('AddNode');
    dispatch(updateSelectedNodeId(ecNode.id));
    await electron.startNode(ecNode.id);
    await electron.startNode(ccNode.id);
  };

  const disableSaveButton = useCallback((value: boolean) => {
    setIsSaveButtonDisabled(value);
  }, []);

  const onCancel = () => {
    if (step === 0) {
      modalOnClose();
    } else if (step === 1) {
      setStep(0);
    } else {
      setStep(1);
    }
  };

  const onSave = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (isPodmanRunning || sIsPodmanRunning) {
        modalOnSaveConfig(undefined);
        modalOnClose();
      } else {
        setStep(2);
      }
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
      buttonSaveVariant={buttonSaveVariant}
      buttonSaveIcon="play"
      buttonCancelLabel={buttonCancelLabel}
      modalOnSaveConfig={onSave}
      modalOnClose={modalOnClose}
      modalOnCancel={onCancel}
      isSaveButtonDisabled={isSaveButtonDisabled}
    >
      <AddNodeStepperModal
        step={step}
        setIsPodmanRunning={setIsPodmanRunning}
        modal
        modalConfig={modalConfig}
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig,
          );
        }}
        disableSaveButton={disableSaveButton}
      />
    </Modal>
  );
};
