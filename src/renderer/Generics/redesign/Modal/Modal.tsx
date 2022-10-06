import { CgCloseO } from 'react-icons/cg';

import IconButton from '../../../IconButton';
import { modalBackdropStyle, modalContentStyle } from './modal.css';

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
  return (
    <div
      style={{
        display: isOpen ? 'flex' : 'none',
      }}
      className={modalBackdropStyle}
    >
      <div
        className={modalContentStyle}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: isFullScreen ? '95vh' : '',
          width: isFullScreen ? '95vw' : '',
        }}
      >
        <div style={{ display: 'flex' }}>
          <h1 style={{ flexGrow: 1 }}>{title}</h1>
          <IconButton
            type="button"
            onClick={onClickCloseButton}
            style={{ paddingRight: 0 }}
          >
            <CgCloseO />
          </IconButton>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
};
