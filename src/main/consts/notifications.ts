export const TIME = Object.freeze({
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
});

// TODO: replace titles and description with string keys
export const NOTIFICATIONS = Object.freeze({
  INFO: {
    SYNC_COMMITTEE: {
      title: 'Scheduled for Sync Commitee Duty',
      description: 'Validator',
      limit: 0,
    },
    SLASH_REWARD: {
      title: 'Reward for slashing another validator',
      description: 'Validator',
      limit: 0,
    },
  },
  COMPLETED: {
    CLIENT_UPDATED: {
      title: 'Client successfuly updated',
      description: 'consensus client',
      limit: 0,
    },
  },
  DOWNLOAD: {
    UPDATE_AVAILABLE: {
      title: 'Client successfuly updated',
      description: 'consensus client',
      limit: 0,
    },
  },
  WARNING: {
    CONNECTION_DOWN: {
      title: 'Internet connection down',
      description: 'All nodes affected',
      limit: TIME.HOUR,
    },
  },
});
