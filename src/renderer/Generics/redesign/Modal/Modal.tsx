import { useCallback, useEffect } from 'react';
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
import { ModalConfig } from '../../../Presentational/ModalManager/modalUtils';

type Props = {
  modalType?: 'alert' | 'modal';
  modalStyle?: string;
  modalTitle: string;
  backButtonEnabled?: boolean;
  children: React.ReactElement[] | React.ReactElement;
  buttonCancelLabel?: string;
  buttonSaveLabel?: string;
  buttonSaveType?: ButtonProps['type'];
  buttonSaveVariant?: ButtonProps['variant'];
  buttonSaveIcon?: ButtonProps['iconId'];
  isSaveButtonDisabled?: boolean;
  modalOnSaveConfig: (updatedConfig: ModalConfig | undefined) => void;
  modalOnClose: () => void;
  modalOnCancel: () => void;
};

export const Modal = ({
  children,
  modalType = 'modal',
  modalStyle = '',
  modalTitle = '',
  backButtonEnabled = true,
  buttonCancelLabel = 'Cancel',
  buttonSaveLabel = 'Save',
  buttonSaveType = 'primary',
  buttonSaveVariant = 'text',
  buttonSaveIcon = 'play',
  isSaveButtonDisabled = false,
  modalOnSaveConfig,
  modalOnClose,
  modalOnCancel,
}: Props) => {
  const escFunction = useCallback(
    (event: { key: string }) => {
      if (event.key === 'Escape') {
        modalOnClose();
      }
    },
    [modalOnClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  return (
    <div className={modalBackdropStyle}>
      <div className={[modalContentStyle, modalStyle].join(' ')}>
        {modalType !== 'alert' && (
          <div className={modalCloseButton}>
            <Button
              variant="icon"
              iconId="close"
              type="ghost"
              onClick={modalOnClose}
            />
          </div>
        )}
        <div className={[modalHeaderContainer, modalType].join(' ')}>
          <span className={[titleFont, modalType].join(' ')}>{modalTitle}</span>
        </div>
        <div
          className={[modalChildrenContainer, modalStyle, modalType].join(' ')}
        >
          {children}
        </div>
        <div className={[modalStepperContainer, modalType].join(' ')}>
          {backButtonEnabled && (
            <Button
              variant="text"
              type="secondary"
              label={buttonCancelLabel}
              onClick={modalOnCancel}
            />
          )}
          <Button
            variant={buttonSaveVariant}
            type={buttonSaveType}
            iconId={buttonSaveIcon}
            disabled={isSaveButtonDisabled}
            label={buttonSaveLabel}
            onClick={() => {
              modalOnSaveConfig(undefined);
            }}
          />
        </div>
      </div>
    </div>
  );
};
