import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationStatus } from 'renderer/Generics/redesign/NotificationItem/NotificationItem';

export interface NotificationType {
  unread: boolean;
  status: NotificationStatus;
  title: string;
  description: string;
  timestamp: number;
}

export interface NotificationState {
  notifications: NotificationType[];
}

const initialState: NotificationState = {
  notifications: [],
};

const loadState = (): NotificationState | undefined => {
  try {
    const serializedState = localStorage.getItem('notifications');
    if (serializedState === null) {
      return undefined;
    }
    return { notifications: JSON.parse(serializedState) };
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

const saveState = (state: NotificationState) => {
  try {
    const serializedState = JSON.stringify(state.notifications);
    localStorage.setItem('notifications', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: loadState() || initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationType>) => {
      state.notifications.push(action.payload);
      saveState(state);
    },
    addNotifications: (state, action: PayloadAction<NotificationType[]>) => {
      state.notifications.push(...action.payload);
      saveState(state);
    },
    removeNotifications: (state) => {
      state.notifications = [];
      saveState(state);
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.unread = false;
      });
      saveState(state);
    },
  },
});

export const {
  addNotification,
  addNotifications,
  removeNotifications,
  markAllAsRead,
} = notificationSlice.actions;

export const getNotifications = (state: { notifications: NotificationState }) =>
  state.notifications.notifications;

export default notificationSlice.reducer;
