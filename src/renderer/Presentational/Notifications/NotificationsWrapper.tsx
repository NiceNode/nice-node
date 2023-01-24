import {
  getNotifications,
  markAllAsRead,
  addNotification,
  removeNotifications,
} from 'main/notifications';
import { useState } from 'react';
import moment from 'moment';
import Notifications from './Notifications';

const NotificationsWrapper = () => {
  const [notifications, setNotifications] = useState(getNotifications);

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = markAllAsRead();
    setNotifications(updatedNotifications);
  };

  const onSettingsClick = () => {
    console.log('setting was clicked!');
    // setNotifications(removeNotifications);
    // addNotification({
    //   unread: true,
    //   status: 'info',
    //   title: 'Scheduled for Sync Commitee Duty',
    //   description: 'Validator 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    //   timestamp: moment().unix(),
    // });
    // setNotifications(getNotifications);
  };

  const onNotificationItemClick = () => {
    console.log('notification was clicked, open the route');
  };

  return (
    <Notifications
      data={notifications}
      markAllNotificationsAsRead={markAllNotificationsAsRead}
      onSettingsClick={onSettingsClick}
      onNotificationItemClick={onNotificationItemClick}
    />
  );
};
export default NotificationsWrapper;
