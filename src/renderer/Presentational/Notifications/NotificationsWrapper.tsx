import { useState } from 'react';
import Notifications from './Notifications';

const NotificationsWrapper = () => {
  // make component aware
  const fetchNotifications = () => {
    // eslint-disable-next-line global-require
    return require('./notificationsData.json');
  };

  const [notifications, setNotifications] = useState(fetchNotifications);

  const updateNotifications = () => {
    console.log('update the list');
    // need backend API that makes changes to JSON file
    // setNotifications();
  };

  const onSettingsClick = () => {
    console.log('setting was clicked!');
  };

  const onNotificationItemClick = () => {
    console.log('notification was clicked, open the route');
  };

  return (
    <Notifications
      data={notifications}
      updateNotifications={updateNotifications}
      onSettingsClick={onSettingsClick}
      onNotificationItemClick={onNotificationItemClick}
    />
  );
};
export default NotificationsWrapper;
