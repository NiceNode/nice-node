// import { Notification } from 'electron';

export const sendDesktopNotification = () => {
  // notification API isn't working
};

export const getNotifications = () => {
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem('notifications'));
};

export const removeNotifications = () => {
  localStorage.setItem('notifications', JSON.stringify([]));
  return [];
};

export const addNotification = (notification) => {
  const notifications = getNotifications();
  notifications.push(notification);

  localStorage.setItem('notifications', JSON.stringify(notifications));
};

export const markAllAsRead = () => {
  const notifications = JSON.parse(localStorage.getItem('notifications'));

  notifications.forEach((notification) => {
    notification.unread = false;
  });

  localStorage.setItem('notifications', JSON.stringify(notifications));

  return notifications;
};
