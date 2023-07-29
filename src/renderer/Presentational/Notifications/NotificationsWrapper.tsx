import electron from '../../electronGlobal';
import { useGetNotificationsQuery } from '../../state/notificationsService';
import Notifications from './Notifications';

export const NotificationsWrapper = () => {
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
