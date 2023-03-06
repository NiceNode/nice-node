// import LabelValues from '../../Generics/redesign/LabelValues/LabelValues';
import {
  NotificationItem,
  NotificationItemProps,
} from '../../Generics/redesign/NotificationItem/NotificationItem';
import Button from '../../Generics/redesign/Button/Button';
import {
  headerContainer,
  spacer,
  titleStyle,
  emptyNotifications,
} from './notifications.css';

export type NotificationsType = {
  data: NotificationItemProps[];
  markAllNotificationsAsRead: () => void;
  onSettingsClick: () => void;
  onNotificationItemClick: () => void;
};

const Notifications = (props: NotificationsType) => {
  const {
    data,
    markAllNotificationsAsRead,
    onSettingsClick,
    onNotificationItemClick,
  } = props;

  const areAllNotificationsRead = () => {
    return data.every((item) => item.unread === false);
  };

  const renderContent = () => {
    if (data.length > 0) {
      return (
        <div>
          {data.map((item) => {
            return (
              <NotificationItem {...item} onClick={onNotificationItemClick} />
            );
          })}
        </div>
      );
    }
    return <div className={emptyNotifications}>There are no notifications</div>;
  };

  return (
    <>
      <div className={headerContainer}>
        <div className={titleStyle}>Notifications</div>
        <div className={spacer} />
        <Button
          label="Mark all as read"
          iconId="check"
          variant="icon-left"
          size="small"
          disabled={areAllNotificationsRead()}
          onClick={markAllNotificationsAsRead}
        />
        <Button
          iconId="settings"
          variant="icon"
          size="small"
          onClick={onSettingsClick}
        />
      </div>
      {renderContent()}
    </>
  );
};
export default Notifications;
