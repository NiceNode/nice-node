import {
  container,
  messageIcon,
  textContainer,
  messageTitle,
  messageDescription,
  closeContainer,
} from './message.css';

import { Icon } from '../Icon/Icon';
import { HeaderButton } from '../HeaderButton/HeaderButton';
import { IconId } from '../../../assets/images/icons';

const getIconId = (type: string) => {
  let iconId: IconId = 'blank';
  switch (type) {
    case 'info':
      iconId = 'shape1';
      break;
    case 'warning':
      iconId = 'shape2';
      break;
    case 'error':
      iconId = 'shape3';
      break;
    case 'success':
      iconId = 'shape4';
      break;
    default:
      break;
  }
  return iconId;
};
export interface MessageProps {
  /**
   * Message type
   */
  type: 'info' | 'success' | 'warning' | 'error';
  /**
   * Message title
   */
  title: string;
  /**
   * Message description
   */
  description?: string;
  /**
   * onClick event
   */
  onClick?: () => void;
}

export const Message = ({
  type,
  title,
  description,
  onClick,
}: MessageProps) => {
  return (
    <div className={[container, `${type}`].join(' ')}>
      <div className={[messageIcon, `${type}`].join(' ')}>
        <Icon iconId={getIconId(type)} />
      </div>
      <div className={textContainer}>
        <div className={messageTitle}>{title}</div>
        {description && <div className={messageDescription}>{description}</div>}
      </div>
      {onClick && (
        <div className={closeContainer}>
          <HeaderButton type="close" onClick={onClick} />
        </div>
      )}
    </div>
  );
};
