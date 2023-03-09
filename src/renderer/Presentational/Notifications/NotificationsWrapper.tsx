import electron from 'renderer/electronGlobal';
import { useGetNotificationsQuery } from 'renderer/state/notificationsService';
import Notifications from './Notifications';

const NotificationsWrapper = () => {
  const qNotifications = useGetNotificationsQuery();

  const onNotificationItemClick = () => {
    console.log('notification was clicked, open the route');
  };

  return (
    <Notifications
      data={qNotifications.data || []}
      markAllNotificationsAsRead={electron.markAllAsRead}
      onNotificationItemClick={onNotificationItemClick}
      removeNotifications={electron.removeNotifications}
    />
  );
};
export default NotificationsWrapper;
