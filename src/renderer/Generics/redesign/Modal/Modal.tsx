import { useCallback, useEffect } from 'react';
import Button from '../Button/Button';
import {
  modalBackdropStyle,
  modalChildrenContainer,
  modalContentStyle,
  titleFont,
} from './modal.css';

type Props = {
  children: React.ReactNode;
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
  title: string;
  isFullScreen?: boolean;
};

export const Modal = ({
  children,
  isOpen,
  onClickCloseButton,
  title,
  isFullScreen,
}: Props) => {
  const escFunction = useCallback(
    (event) => {
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

  return (
    <div
      style={{
        display: isOpen ? 'flex' : 'none',
        // paddingTop: 30 leaves room for the drag bar on mac
        paddingTop: 30,
      }}
      className={modalBackdropStyle}
    >
      <div
        className={modalContentStyle}
        style={{
          height: isFullScreen ? '95vh' : '',
          width: isFullScreen ? '95vw' : '',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 40, alignSelf: 'flex-end' }}>
            <div style={{ position: 'absolute', top: 12, right: 14 }}>
              <Button
                variant="icon"
                iconId="close"
                ghost
                onClick={onClickCloseButton}
              />
            </div>
          </div>
          <span className={titleFont} style={{ flexGrow: 1 }}>
            {title}
          </span>
        </div>
        <div className={modalChildrenContainer}>{children}</div>
      </div>
    </div>
  );
};
