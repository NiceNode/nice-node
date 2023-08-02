import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import {
  actionButtonsContainer,
  modalBackdropStyle,
  modalChildrenContainer,
  modalContentStyle,
  titleFont,
} from './alert.css';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
  onClickActionButton: () => void;
  title: string;
  message: string;
  acceptType?: 'danger' | 'primary';
  acceptText?: string;
};

export const Alert = ({
  isOpen,
  onClickCloseButton,
  onClickActionButton,
  title,
  message,
  acceptType,
  acceptText,
}: Props) => {
  const { t } = useTranslation('genericComponents');

  const escFunction = useCallback(
    (event: { key: string }) => {
      if (event.key === 'Escape') {
        // Do whatever when esc is pressed
        onClickCloseButton();
      }
    },
    [onClickCloseButton],
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  const acceptTextDisplay = acceptText ?? t('Confirm');
  const acceptTypeDisplay = acceptType ?? 'primary';

  return (
    <div
      style={{
        display: isOpen ? 'flex' : 'none',
        // paddingTop: 30 leaves room for the drag bar on mac
        paddingTop: 30,
      }}
      className={modalBackdropStyle}
    >
      <div className={modalContentStyle}>
        <span className={titleFont} style={{ flexGrow: 1 }}>
          {title}
        </span>
        <div className={modalChildrenContainer}>
          <span>{message}</span>
        </div>

        <div className={actionButtonsContainer}>
          <Button label={t('Cancel')} onClick={onClickCloseButton} />
          <Button
            label={acceptTextDisplay}
            type={acceptTypeDisplay}
            onClick={onClickActionButton}
          />
        </div>
      </div>
    </div>
  );
};
