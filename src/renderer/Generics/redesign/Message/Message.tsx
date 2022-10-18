import { container, messageTitle, messageDescription } from './message.css';

import Button from '../Button/Button';
import ExternalLink from '../Link/ExternalLink';

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
  return (
    <div className={[container, `${type}`].join(' ')}>
      <div className={messageTitle}>{title}</div>
      <div className={messageDescription}>{description}</div>
    </div>
  );
};
