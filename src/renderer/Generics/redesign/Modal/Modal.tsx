import { useCallback, useEffect } from 'react';
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
  const dispatch = useAppDispatch();

  const resetModal = useCallback(() => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
        config: {},
      })
    );
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
  // Render the appropriate screen based on the current `screen` value
  switch (screen.route) {
    // Modals
    case 'addNode':
      modalContent = (
        <AddNodeStepper
          modal
          modalOnChangeConfig={modalOnChangeConfig}
          onChange={(newValue: 'done' | 'cancel') => {
            if (newValue === 'done' || newValue === 'cancel') {
              resetModal();
            }
          }}
        />
      );
      break;
    case 'nodeSettings':
      modalTitle = t('NodeSettings');
      modalType = 'tabs';
      modalContent = (
        <NodeSettingsWrapper modalOnChangeConfig={modalOnChangeConfig} />
      );
      break;
    case 'preferences':
      modalTitle = t('Preferences');
      modalContent = (
        <PreferencesWrapper modalOnChangeConfig={modalOnChangeConfig} />
      );
      break;
    case 'addValidator':
      modalContent = <>Add Validator</>;
      break;
    case 'clientVersions':
      modalContent = <>Client Versions</>;
      break;

    // Alerts
    case 'stopNode':
      modalContent = <>Stop Node</>;
      break;
    case 'removeNode':
      modalTitle = t('RemoveNode');
      modalContent = (
        <RemoveNodeWrapper
          isOpen
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
      break;
    case 'updateUnvailable':
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
            label="Save"
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
