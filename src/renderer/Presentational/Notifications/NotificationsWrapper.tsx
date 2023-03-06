import { useState } from 'react';
import { getNotifications, markAllAsRead } from '../../../main/notifications';
import Notifications from './Notifications';

const NotificationsWrapper = () => {
  const [notifications, setNotifications] = useState(getNotifications);

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = markAllAsRead();
    setNotifications(updatedNotifications);
  };

  const onSettingsClick = () => {
    console.log('setting was clicked!');
    // removeNotifications();
    // setNotifications(getNotifications);
    // addNotifications([
    //   {
    //     unread: true,
    //     status: 'info',
    //     title: 'Scheduled for Sync Commitee Duty',
    //     description: 'Validator 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    //     timestamp: 1673384953,
    //   },
    //   {
    //     unread: true,
    //     status: 'info',
    //     title: 'Reward for slashing another validator',
    //     description: 'Validator 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    //     timestamp: 1673384953,
    //   },
    //   {
    //     unread: true,
    //     status: 'completed',
    //     title: 'Client successfuly updated',
    //     description: 'Lodestar consensus client',
    //     timestamp: 1673384953,
    //   },
    //   {
    //     unread: true,
    //     status: 'download',
    //     title: 'Client update available',
    //     description: 'Lodestar consensus client',
    //     timestamp: 1673384953,
    //   },
    //   {
    //     unread: false,
    //     status: 'warning',
    //     title: 'More than 40 log errors in one hour',
    //     description: 'Lodestar consensus client',
    //     timestamp: 1673384953,
    //   },
    //   {
    //     unread: false,
    //     status: 'warning',
    //     title: 'Disk usage near 90%',
    //     description:
    //       'All nodes affected. Consider upgrading your disk to one with at least 2TB of storage.',
    //     timestamp: 1673384953,
    //   },
    //   {
    //     unread: false,
    //     status: 'warning',
    //     title: 'Internet connection down for 12 minutes',
    //     description: 'All nodes affected',
    //     timestamp: 1673384953,
    //   },
    // ]);
    // setNotifications(getNotifications);
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
