import { useState } from 'react';
import Notifications from './Notifications';

const NotificationsWrapper = () => {
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

  return (
    <Notifications
      data={notifications}
      updateNotifications={updateNotifications}
      onSettingsClick={onSettingsClick}
    />
  );
};
export default NotificationsWrapper;
