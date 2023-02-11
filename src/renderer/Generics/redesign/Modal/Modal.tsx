import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddNodeStepperModal from '../../../Presentational/AddNodeStepper/AddNodeStepperModal';
import PreferencesWrapper from '../../../Presentational/Preferences/PreferencesWrapper';
import NodeSettingsWrapper from '../../../Presentational/NodeSettings/NodeSettingsWrapper';
import RemoveNodeWrapper from '../../../Presentational/RemoveNodeModal/RemoveNodeWrapper';
import { useAppDispatch } from '../../../state/hooks';
import { ModalScreen, setModalState } from '../../../state/modal';
import Button, { ButtonProps } from '../Button/Button';
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
import { ModalConfig } from './ModalManager';

type Props = {
  screen: ModalScreen;
  modalOnSaveConfig: () => void;
  modalOnChangeConfig: (config: ModalConfig) => void;
  modalOnClose: () => void;
};

export const Modal = ({
  modalOnSaveConfig,
  modalOnChangeConfig,
  modalOnClose,
  screen,
}: Props) => {
  const { t } = useTranslation('genericComponents');
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [step, setStep] = useState(0);
  const dispatch = useAppDispatch();

  // keep track of steps here
  // but keep the modalConfig info, in modalManager.

  const disableSaveButton = useCallback((value: boolean) => {
    setIsSaveButtonDisabled(value);
  }, []);

  const resetModal = useCallback(() => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
      })
    );
    modalOnClose();
    setIsSaveButtonDisabled(false);
  }, [dispatch, modalOnClose]);

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
  let buttonCancelLabel = 'Cancel';
  const backButtonEnabled = true;
  let buttonType: ButtonProps['type'] = 'primary';
  // Render the appropriate screen based on the current `screen` value
  switch (screen.route) {
    // Modals
    case modalRoutes.addNode:
      modalTitle =
        step === 0 ? 'Launch an Ethereum Node' : 'Docker Installation';
      modalContent = (
        <AddNodeStepperModal
          step={step}
          modal
          modalOnChangeConfig={modalOnChangeConfig}
          disableSaveButton={disableSaveButton}
        />
      );
      buttonSaveLabel = step === 0 ? 'Next' : 'Done';
      buttonCancelLabel = step === 0 ? 'Cancel' : 'Back';
      // backButtonEnabled = step === 0;
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
      modalTitle = 'Are you sure you want to remove this node?';
      modalContent = (
        <RemoveNodeWrapper modalOnChangeConfig={modalOnChangeConfig} />
      );
      buttonSaveLabel = 'Remove node';
      buttonType = 'danger';
      break;
    case modalRoutes.updateUnavailable:
      modalContent = <>Update unavailable</>;
      break;
    default:
  }

  const tabStyle = modalType === 'tabs' ? 'tabs' : '';
  const alertStyle = screen.type === 'alert' ? 'alert' : '';
  return (
    <div className={modalBackdropStyle}>
      <div className={modalContentStyle}>
        {screen.type !== 'alert' && (
          <div className={modalCloseButton}>
            <Button
              variant="icon"
              iconId="close"
              type="ghost"
              onClick={resetModal}
            />
          </div>
        )}
        <div className={[modalHeaderContainer, alertStyle].join(' ')}>
          <span className={[titleFont, alertStyle].join(' ')}>
            {modalTitle}
          </span>
        </div>
        <div
          className={[modalChildrenContainer, tabStyle, alertStyle].join(' ')}
        >
          {modalContent}
        </div>
        <div className={[modalStepperContainer, alertStyle].join(' ')}>
          {backButtonEnabled && (
            <Button
              variant="text"
              type="secondary"
              label={buttonCancelLabel}
              onClick={() => {
                if (screen.route === 'addNode') {
                  if (step === 0) {
                    resetModal();
                  } else {
                    setStep(0);
                  }
                } else if (screen.route === 'removeNode') {
                  dispatch(
                    setModalState({
                      isModalOpen: true,
                      screen: { route: 'nodeSettings', type: 'modal' },
                    })
                  );
                } else {
                  resetModal();
                }
              }}
            />
          )}
          <Button
            variant="text"
            type={buttonType}
            disabled={isSaveButtonDisabled}
            label={buttonSaveLabel}
            onClick={() => {
              if (screen.route === 'addNode' && step === 0) {
                setStep(1);
              } else {
                modalOnSaveConfig();
                resetModal();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
