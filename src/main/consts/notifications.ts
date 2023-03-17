export const TIME = Object.freeze({
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
});

const enum STATUS {
  INFO = 'info',
  COMPLETED = 'completed',
  DOWNLOAD = 'download',
  WARNING = 'warning',
}

export interface NotificationProps {
  title: string;
  description: string;
  status: string;
  limit: number;
}

// TODO: replace titles and description with string keys
export const NOTIFICATIONS = Object.freeze({
  INFO: {
    SYNC_COMMITTEE: {
      title: 'Scheduled for Sync Commitee Duty',
      description: 'Validator',
      status: STATUS.INFO,
      limit: 0,
    },
    SLASH_REWARD: {
      title: 'Reward for slashing another validator',
      description: 'Validator',
      status: STATUS.INFO,
      limit: 0,
    },
  },
  COMPLETED: {
    CLIENT_UPDATED: {
      title: 'Client successfuly updated',
      description: 'consensus client',
      status: STATUS.COMPLETED,
      limit: 0,
    },
  },
  DOWNLOAD: {
    UPDATE_AVAILABLE: {
      title: 'Client successfuly updated',
      description: 'consensus client',
      status: STATUS.DOWNLOAD,
      limit: 0,
    },
  },
  WARNING: {
    LOW_DISK_SPACE: {
      title: 'Low disk space',
      description: 'Disk space is lower than 40GB',
      status: STATUS.WARNING,
      limit: TIME.DAY,
    },
    CONNECTION_DOWN: {
      title: 'Internet connection down',
      description: 'All nodes affected',
      status: STATUS.WARNING,
      limit: TIME.HOUR,
    },
  },
});
