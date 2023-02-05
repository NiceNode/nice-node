import { useCallback, useEffect } from 'react';
import Button from '../Button/Button';
import {
  modalHeaderContainer,
  modalBackdropStyle,
  modalCloseButton,
  modalChildrenContainer,
  modalContentStyle,
  titleFont,
} from './modal.css';
import { ModalStepper } from './ModalStepper';

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
          <span className={titleFont} style={{ flexGrow: 1 }}>
            {title}
          </span>
        </div>
        <div className={modalChildrenContainer}>{children}</div>
        <ModalStepper />
      </div>
    </div>
  );
};
