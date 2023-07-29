import { useCallback, useEffect, useState, useRef } from 'react';
import Button, { ButtonProps } from '../Button/Button';
import {
  modalHeaderContainer,
  modalBackdropStyle,
  modalChildrenContainer,
  modalContentStyle,
  modalStepperContainer,
  titleFont,
} from './modal.css';
import { ModalConfig } from '../../../Presentational/ModalManager/modalUtils';
import { ContentHeader } from '../ContentHeader/ContentHeader';

type Props = {
  modalType?: 'alert' | 'modal' | 'info';
  modalStyle?: string;
  modalTitle?: string;
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
  const [isVisible, setIsVisible] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (modalType === 'modal') {
      let timeoutId: NodeJS.Timeout;
      const handleScroll = () => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          const modalContent = modalContentRef.current;
          if (modalContent && modalContent.scrollTop > 20) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        }, 100);
      };

      const modalContent = modalContentRef.current;

      if (modalContent) {
        modalContent.addEventListener('scroll', handleScroll);
      }

      return () => {
        if (modalContent) {
          modalContent.removeEventListener('scroll', handleScroll);
        }
        clearTimeout(timeoutId);
      };
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={modalBackdropStyle}>
      <div className={[modalContentStyle, modalStyle].join(' ')}>
        {modalType === 'modal' && (
          <ContentHeader
            title={modalTitle}
            textAlign="center"
            isVisible={isVisible}
            manualVisibility
          />
        )}
        <div
          className={[modalChildrenContainer, modalStyle, modalType].join(' ')}
          ref={modalContentRef}
        >
          <div className={[modalHeaderContainer, modalType].join(' ')}>
            <span className={[titleFont, modalType, modalStyle].join(' ')}>
              {modalTitle}
            </span>
          </div>
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
