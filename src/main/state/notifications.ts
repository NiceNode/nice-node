/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationProps } from 'main/consts/notifications';
import { NotificationItemProps } from 'renderer/Generics/redesign/NotificationItem/NotificationItem';
import { send } from '../messenger';
import store from './store';

const { Notification } = require('electron');

export const NOTIFICATIONS_KEY = 'notifications';

export interface NotificationPopupType {
  title: string;
  body: string;
  silent: boolean;
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
  store.onDidChange(NOTIFICATIONS_KEY, () => {
    send(NOTIFICATIONS_KEY);
  });
};
initialize();

export const getNotifications = () => {
  const notifications = store.get(NOTIFICATIONS_KEY) || [];
  return notifications;
};

export const displayNotification = (notification: NotificationItemProps) => {
  const { title, description } = notification;
  const electronNotification = {
    title,
    body: description,
    silent: false,
  } as NotificationPopupType;
  const renderNotification = new Notification(electronNotification);
  renderNotification.show();
};

const checkIfNotificationCanBeAdded = (
  storedNotifications: NotificationItemProps[],
  notificationObject: NotificationProps
) => {
  if (storedNotifications.length === 0 || storedNotifications.length < 1000)
    return true;
  const currentTimestamp = Date.now();
  const existingNotificationIndex = storedNotifications.findIndex(
    (notification: NotificationItemProps) =>
      notification.title === notificationObject.title
  );
  if (existingNotificationIndex === -1) return true;

  const existingNotification = storedNotifications[existingNotificationIndex];

  // can be added if the current timestamp is more than the existing notification timestamp + the limit
  return (
    currentTimestamp > existingNotification.timestamp + notificationObject.limit
  );
};

// TODO: add variable support for language string keys
export const addNotification = (notificationObject: NotificationProps) => {
  const notifications = store.get(NOTIFICATIONS_KEY) || [];
  if (checkIfNotificationCanBeAdded(notifications, notificationObject)) {
    const { title, description, status } = notificationObject;
    const newNotification = {
      title,
      description,
      unread: true,
      status: status as NotificationItemProps['status'],
      timestamp: Date.now(),
    };
    notifications.unshift(newNotification);
    store.set(NOTIFICATIONS_KEY, notifications);
    if (store.get('settings.appIsNotificationsEnabled')) {
      displayNotification(newNotification);
    }
  }
};

export const markAllAsRead = () => {
  const notifications = store.get(NOTIFICATIONS_KEY) || [];
  notifications.forEach((notification: NotificationItemProps) => {
    notification.unread = false;
  });
  store.set(NOTIFICATIONS_KEY, notifications);
};

export const removeNotifications = () => {
  store.set(NOTIFICATIONS_KEY, []);
};
