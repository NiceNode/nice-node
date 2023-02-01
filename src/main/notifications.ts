// import { Notification } from 'electron';

export type NotificationType = {
  unread: boolean;
  status: string;
  title: string;
  description: string;
  timestamp: number;
};

export const displayNotification = () => {
  // new Notification({
  //   title,
  //   body,
  // }).show();
};

export const getNotifications = () => {
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem('notifications') || '');
};

export const removeNotifications = () => {
  localStorage.setItem('notifications', JSON.stringify([]));
  return [];
};

export const addNotification = (notification: NotificationType) => {
  const notifications = getNotifications();
  notifications.push(notification);

  localStorage.setItem('notifications', JSON.stringify(notifications));
};

export const addNotifications = (notifications: NotificationType[]) => {
  notifications.forEach((notification: NotificationType) => {
    addNotification(notification);
  });
};

export const markAllAsRead = () => {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '');

  notifications.forEach((notification: NotificationType) => {
    notification.unread = false;
  });

  localStorage.setItem('notifications', JSON.stringify(notifications));

  return notifications;
};

export const initialize = async () => {
  console.log('test initialize');
};
