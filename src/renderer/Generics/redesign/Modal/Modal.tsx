import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type ModalConfig,
  modalRoutes,
} from '../../../Presentational/ModalManager/modalUtils';
import Button, { type ButtonProps } from '../Button/Button';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import {
  modalBackdropStyle,
  modalChildrenContainer,
  modalContentStyle,
  modalHeaderContainer,
  modalStepperContainer,
  titleFont,
} from './modal.css';

type Props = {
  modalType?: 'alert' | 'modal' | 'info' | 'simple';
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
  route?: string;
  modalOnSaveConfig: (updatedConfig: ModalConfig | undefined) => void;
  modalOnClose: () => void;
  modalOnCancel: () => void;
};

export const Modal = ({
  children,
  modalType = 'modal',
  modalStyle = '',
  modalTitle = '',
  route = '',
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
    [modalOnClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    if (modalType === 'modal') {
      let timeoutId: ReturnType<typeof setTimeout>;
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
  }, []);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Check if the click target is the backdrop itself
      if (event.target === event.currentTarget) {
        modalOnClose();
      }
    },
    [modalOnClose],
  );

  return (
    <div className={modalBackdropStyle} onClick={handleBackdropClick}>
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
          {route !== modalRoutes.alphaBuild && route !== modalRoutes.update && (
            <div className={[modalHeaderContainer, modalType].join(' ')}>
              <span
                id="modalTitle"
                className={[titleFont, modalType, modalStyle].join(' ')}
              >
                {modalTitle}
              </span>
            </div>
          )}
          {children}
        </div>
        {modalType !== 'simple' && (
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
        )}
      </div>
    </div>
  );
};
