import { useCallback, useEffect, useState } from 'react';
import { ModalScreen, setModalState } from 'renderer/state/modal';
import { useAppDispatch } from 'renderer/state/hooks';
import AddNodeStepper from 'renderer/Presentational/AddNodeStepper/AddNodeStepper';
import PreferencesWrapper from 'renderer/Presentational/Preferences/PreferencesWrapper';
import { useTranslation } from 'react-i18next';
import NodeSettingsWrapper from 'renderer/Presentational/NodeSettings/NodeSettingsWrapper';
import RemoveNodeWrapper, {
  RemoveNodeAction,
} from 'renderer/Presentational/RemoveNodeModal/RemoveNodeWrapper';
import Button from '../Button/Button';
import {
  modalHeaderContainer,
  modalBackdropStyle,
  modalCloseButton,
  modalChildrenContainer,
  modalContentStyle,
  modalStepperContainer,
  titleFont,
} from './modal.css';
import { modalRoutes } from './modalRoutes';

type Props = {
  screen: ModalScreen;
  modalOnSaveConfig: () => void;
  modalOnChangeConfig: (config: object) => void;
};

export const Modal = ({
  modalOnSaveConfig,
  modalOnChangeConfig,
  screen,
}: Props) => {
  const { t } = useTranslation('genericComponents');
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [step, setStep] = useState(0);
  const dispatch = useAppDispatch();

  // keep track of steps here
  // but keep the modalConfig info, in modalManager.

  const disableSaveButton = useCallback(() => {
    setIsSaveButtonDisabled(true);
  }, []);

  const resetModal = useCallback(() => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
        config: {},
      })
    );
    setIsSaveButtonDisabled(false);
  }, [dispatch]);

  const escFunction = useCallback(
    (event: { key: string }) => {
      if (event.key === 'Escape') {
        resetModal();
      }
    },
    [resetModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  let modalContent = <></>;
  let modalTitle = '';
  let modalType = '';
  let buttonSaveLabel = 'Save';
  let noOp = () => {};
  // Render the appropriate screen based on the current `screen` value
  switch (screen.route) {
    // Modals
    case modalRoutes.addNode:
      modalContent = (
        <AddNodeStepper modal modalOnChangeConfig={modalOnChangeConfig} />
      );
      buttonSaveLabel = step === 0 ? 'Next' : 'Done';
      noOp = () => {};
      break;
    case modalRoutes.nodeSettings:
      modalTitle = t('NodeSettings');
      modalType = 'tabs';
      modalContent = (
        <NodeSettingsWrapper
          modalOnChangeConfig={modalOnChangeConfig}
          disableSaveButton={disableSaveButton}
        />
      );
      buttonSaveLabel = 'Save changes';
      break;
    case modalRoutes.preferences:
      modalTitle = t('Preferences');
      modalContent = (
        <PreferencesWrapper modalOnChangeConfig={modalOnChangeConfig} />
      );
      break;
    case modalRoutes.addValidator:
      modalContent = <>Add Validator</>;
      break;
    case modalRoutes.clientVersions:
      modalContent = <>Client Versions</>;
      break;

    // Alerts
    case modalRoutes.stopNode:
      modalContent = <>Stop Node</>;
      buttonSaveLabel = 'Stop node';
      break;
    case modalRoutes.removeNode:
      modalTitle = t('RemoveNode');
      modalContent = (
        <RemoveNodeWrapper
          onClose={(action: RemoveNodeAction) => {
            if (action === 'remove') {
              resetModal();
            } else {
              dispatch(
                setModalState({
                  isModalOpen: true,
                  screen: { route: 'nodeSettings', type: 'modal' },
                  config: {},
                })
              );
            }
          }}
        />
      );
      buttonSaveLabel = 'Remove node';
      break;
    case modalRoutes.updateUnvailable:
      modalContent = <>Update unavailable</>;
      break;
    default:
  }

  const tabStyle = modalType === 'tabs' ? 'tabs' : '';
  return (
    <div className={modalBackdropStyle}>
      <div className={modalContentStyle}>
        <div className={modalCloseButton}>
          <Button
            variant="icon"
            iconId="close"
            type="ghost"
            onClick={resetModal}
          />
        </div>
        <div className={modalHeaderContainer}>
          <span className={titleFont}>{modalTitle}</span>
        </div>
        <div className={[modalChildrenContainer, tabStyle].join(' ')}>
          {modalContent}
        </div>
        <div className={modalStepperContainer}>
          <Button
            variant="text"
            type="secondary"
            label="Cancel"
            onClick={resetModal}
          />
          <Button
            variant="text"
            type="primary"
            disabled={isSaveButtonDisabled}
            label={buttonSaveLabel}
            onClick={() => {
              modalOnSaveConfig();
              resetModal();
            }}
          />
        </div>
      </div>
    </div>
  );
};
