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
      title: 'Internet connection down for 12 minutes',
      description: 'All nodes affected',
      limit: 3600000,
    },
  },
});
