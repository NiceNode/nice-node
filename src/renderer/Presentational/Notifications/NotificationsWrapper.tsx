import { useEffect } from 'react';
import electron from 'renderer/electronGlobal';
import { useGetNotificationsQuery } from 'renderer/state/notificationsService';
import Notifications from './Notifications';

const NotificationsWrapper = () => {
  const qNotifications = useGetNotificationsQuery();

  const markAllNotificationsAsRead = () => {
    electron.markAllAsRead();
  };

  const onSettingsClick = () => {
    console.log('setting was clicked!');
    // dispatch(removeNotifications());
    // dispatch(addNotifications([
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
    // ]));
    // electron.removeNotifications();
    electron.addNotification({
      unread: true,
      status: 'info',
      title: 'DING!!!!',
      description: 'Validator 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      timestamp: 1673384953,
    });
  };

  const onNotificationItemClick = () => {
    console.log('notification was clicked, open the route');
  };

  return (
    <Notifications
      data={qNotifications.data || []}
      markAllNotificationsAsRead={markAllNotificationsAsRead}
      onSettingsClick={onSettingsClick}
      onNotificationItemClick={onNotificationItemClick}
    />
  );
};
export default NotificationsWrapper;
