import { useCallback, useEffect } from 'react';
import Button from '../Button/Button';
import { Tabs } from '../Tabs/Tabs';
import {
  modalBackdropStyle,
  modalChildrenContainer,
  modalContentStyle,
  titleFont,
} from './modal.css';

type Props = {
  children: React.ReactElement[] | React.ReactElement;
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
  title?: string;
  isFullScreen?: boolean;
  tabs?: boolean;
};

export const Modal = ({
  children,
  isOpen,
  onClickCloseButton,
  title,
  isFullScreen,
  tabs,
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

  const renderContent = () => {
    if (Array.isArray(children) && tabs) {
      return <Tabs modal>{children}</Tabs>;
    }
    return <div className={modalChildrenContainer}>{children}</div>;
  };

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
        {renderContent()}
      </div>
    </div>
  );
};
