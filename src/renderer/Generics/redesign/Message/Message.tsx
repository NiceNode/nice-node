import {
  container,
  messageIcon,
  textContainer,
  messageTitle,
  messageDescription,
} from './message.css';

import Button from '../Button/Button';
import ExternalLink from '../Link/ExternalLink';
import { Icon } from '../Icon/Icon';

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
  description: string;
}

export const Message = ({ type, title, description }: MessageProps) => {
  let iconId = '';
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
  return (
    <div className={[container, `${type}`].join(' ')}>
      <div className={[messageIcon, `${type}`].join(' ')}>
        <Icon iconId={iconId} />
      </div>
      <div className={textContainer}>
        <div className={messageTitle}>{title}</div>
        <div className={messageDescription}>{description}</div>
      </div>
    </div>
  );
};
