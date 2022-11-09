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
        // paddingTop: 35 leaves room for the drag bar on mac
        paddingTop: isFullScreen ? 35 : '',
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
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
};
