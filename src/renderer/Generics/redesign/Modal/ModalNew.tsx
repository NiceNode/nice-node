import { useCallback, useEffect } from 'react';
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
  children: React.ReactElement[] | React.ReactElement;
  onClickCloseButton: () => void;
  title?: string;
  type?: string;
};

export const ModalNew = ({
  children,
  onClickCloseButton,
  title,
  type = '',
}: Props) => {
  const escFunction = useCallback(
    (event: { key: string }) => {
      if (event.key === 'Escape') {
        // Do whatever when esc is pressed
        onClickCloseButton();
      }
    },
    [onClickCloseButton]
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction]);

  // TODO: manage the default size via eventual modal manager
  const modalSize = {};
  // if (type === 'stepper') {
  //   modalSize = { width: 624, height: 'auto' };
  // } else if (type === 'settings') {
  //   modalSize = { width: 720, height: 658 };
  // } else {
  //   modalSize = {
  //     height: isFullScreen ? '95vh' : '',
  //     width: isFullScreen ? '95vw' : '',
  //   };
  // }

  const tabStyle = type === 'tabs' ? 'tabs' : '';

  return (
    <div className={modalBackdropStyle}>
      <div className={modalContentStyle} style={modalSize}>
        <div className={modalCloseButton}>
          <Button
            variant="icon"
            iconId="close"
            type="ghost"
            onClick={onClickCloseButton}
          />
        </div>
        <div className={modalHeaderContainer}>
          <span className={titleFont}>{title}</span>
        </div>
        <div className={[modalChildrenContainer, tabStyle].join(' ')}>
          {children}
        </div>
        <div className={modalStepperContainer}>
          <Button
            variant="text"
            type="secondary"
            label="Cancel"
            onClick={() => {
              onClickCloseButton();
            }}
          />
          <Button
            variant="text"
            type="primary"
            label="Save"
            onClick={() => {
              // Save settings here
              onClickCloseButton();
            }}
          />
        </div>
      </div>
    </div>
  );
};
