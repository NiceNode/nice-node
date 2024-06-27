export const TIME = Object.freeze({
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
  MONTH: 2592000000,
  YEAR: 31536000000,
});

enum STATUS {
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
    NODE_UPDATED: {
      title: 'Node Update Completed',
      description: 'Node update was completed successfully.',
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
      title: 'LowDiskSpaceTitle',
      description: 'LowDiskSpaceDescription',
      status: STATUS.WARNING,
      limit: TIME.DAY,
    },
    CONNECTION_DOWN: {
      title: 'InternetConnectionDownTitle',
      description: 'InternetConnectionDownDescription',
      status: STATUS.WARNING,
      limit: TIME.HOUR,
    },
    P2P_PORTS_CLOSED: {
      title: 'ClosedPortsTitle',
      description: 'ClosedPortsDescription',
      status: STATUS.WARNING,
      limit: 0,
    },
    UNEXPECTED_PORTS_OPEN: {
      title: 'UnexpectedPortsOpenTitle',
      description: 'UnexpectedPortsOpenDescription',
      status: STATUS.WARNING,
      limit: 0,
    },
    NODE_UPDATE_ERROR: {
      title: 'Node Update Error',
      description: 'A error occurred while updating the node',
      status: STATUS.WARNING,
      limit: 0,
    },
  },
});
