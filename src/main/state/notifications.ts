/* eslint-disable @typescript-eslint/no-explicit-any */
import { send } from '../messenger';
import store from './store';

const { Notification } = require('electron');

export const NOTIFICATIONS_KEY = 'notifications';

export interface NotificationPopupType {
  title: string;
  body: string;
  silent: boolean;
  icon: string;
}

/**
 * Called on app launch.
 * Initializes internal data structures for readiness.
 */
const initialize = () => {
  const notifications = store.get(NOTIFICATIONS_KEY);
  if (!notifications) {
    store.set(NOTIFICATIONS_KEY, []);
  }

  // Notify the UI when values change
  store.onDidChange(NOTIFICATIONS_KEY, (newValue) => {
    send('notifications', newValue);
  });
};
initialize();

export const getNotifications = () => {
  const notifications = store.get(NOTIFICATIONS_KEY) || [];
  return notifications;
};

export const addNotification = (notification) => {
  const notifications = store.get('notifications') || [];
  notifications.push(notification);
  store.set(NOTIFICATIONS_KEY, notifications);
  console.log('notification added', notification);
  return notifications;
};

export const addNotifications = (notifications) => {
  const notificationsStore = store.get('notifications') || [];
  notificationsStore.push(...notifications);
  store.set(NOTIFICATIONS_KEY, notificationsStore);
  return notificationsStore;
};

export const markAllAsRead = () => {
  const notifications = store.get(NOTIFICATIONS_KEY) || [];
  notifications.forEach((notification) => {
    notification.unread = false;
  });
  store.set(NOTIFICATIONS_KEY, notifications);
};

export const removeNotifications = () => {
  store.set(NOTIFICATIONS_KEY, []);
};

export const displayNotification = (notification: NotificationPopupType) => {
  const renderNotification = new Notification(notification);
  renderNotification.show();
};
