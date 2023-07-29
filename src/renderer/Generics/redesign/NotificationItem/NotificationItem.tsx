import moment from 'moment';
import { NotificationIcon } from '../NotificationIcon/NotificationIcon';
import {
  container,
  iconContainer,
  textContainer,
  titleStyle,
  infoStyle,
  rowContainer,
  dateStyle,
} from './notificationItem.css';

export type NotificationStatus =
  | 'info'
  | 'completed'
  | 'download'
  | 'warning'
  | 'error';
export interface NotificationItemProps {
  /**
   * Unread status
   */
  unread: boolean;
  /**
   * Notification title
   */
  title: string;
  /**
   * Notification description
   */
  description: string;
  /**
   * What's the status?
   */
  status: NotificationStatus;
  /**
   * Timestamp of when the event occurred
   */
  timestamp: number;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export const NotificationItem = ({
  onClick,
  title,
  description,
  status,
  unread,
  timestamp,
}: NotificationItemProps) => {
  const onClickAction = () => {
    if (onClick) {
      onClick();
    }
  };

  const containerStyles = [container];

  return (
    <div
      className={containerStyles.join(' ')}
      onClick={onClickAction}
      onKeyDown={onClickAction}
      role="button"
      tabIndex={0}
    >
      <div className={iconContainer}>
        <NotificationIcon unread={unread} status={status} />
      </div>
      <div className={textContainer}>
        <div className={rowContainer}>
          <div className={titleStyle}>{title}</div>
          <div className={dateStyle}>
            {moment(timestamp).format('MMM Do h:mm a')}
          </div>
        </div>
        <div className={infoStyle}>{description}</div>
      </div>
    </div>
  );
};
