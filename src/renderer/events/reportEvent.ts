import * as Fathom from 'fathom-client';
import { eventIdLookup, FATHOM_SITE_ENV, FATHOM_SITE_ID } from './environment';
import { NNEvent } from './events';

/**
 * Components should use this to report significant events. Events will be
 * logged or optionally sent to tracking service for core contributors to review.
 * @param event
 */
export const reportEvent = (event: NNEvent) => {
  console.log('reportEvent: ', event);
  const eventId = eventIdLookup(event);
  Fathom.trackGoal(eventId, 1);
};

export const initialize = () => {
  const fathomSiteId = FATHOM_SITE_ID;
  if (fathomSiteId) {
    console.log('FATHOM_SITE_ID found: ', fathomSiteId);
    Fathom.load(fathomSiteId);
  } else {
    console.log('FATHOM_SITE_ID not found!');
  }
  console.log('process.env.FATHOM_SITE_ENV: ', FATHOM_SITE_ENV);
};
initialize();
