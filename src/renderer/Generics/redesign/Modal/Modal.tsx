import Button from '../Button/Button';
import { modalBackdropStyle, modalContentStyle, titleFont } from './modal.css';

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
          minHeight: 100,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 40, alignSelf: 'flex-end' }}>
            <Button
              variant="icon"
              iconId="close"
              onClick={onClickCloseButton}
            />
          </div>
          <span className={titleFont} style={{ flexGrow: 1 }}>
            {title}
          </span>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
};
