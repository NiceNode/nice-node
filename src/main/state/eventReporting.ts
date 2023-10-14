import { v4 as uuidv4 } from 'uuid';

import logger from '../logger';

import store from './store';

// export type EventReportingState = Record<string, string | object | boolean>;
const EVENT_REPORTING_KEY = 'eventReporting';
const CLIENT_ID_KEY = 'clientId';

export type EventReportingState = {
  [CLIENT_ID_KEY]?: string;
};

/**
 * Called on app launch.
 * Initializes internal data structures for readiness.
 */
const initialize = () => {
  logger.info('Intializing store settings key');
  let eventReporting = store.get(EVENT_REPORTING_KEY);
  if (!eventReporting || typeof eventReporting !== 'object') {
    // create the default settings if no settings are saved yet
    logger.info(
      'No eventReporting state found. Creating a new instance and with a new clientId.',
    );
    eventReporting = {
      [CLIENT_ID_KEY]: uuidv4(),
    };
    store.set(EVENT_REPORTING_KEY, eventReporting);
  } else if (eventReporting?.[CLIENT_ID_KEY] === undefined) {
    eventReporting = {
      ...eventReporting,
      [CLIENT_ID_KEY]: uuidv4(),
    };
    store.set(EVENT_REPORTING_KEY, eventReporting);
  }
};
initialize();

export const getAppClientId = (): boolean => {
  return store.get(`${EVENT_REPORTING_KEY}.${CLIENT_ID_KEY}`);
};
