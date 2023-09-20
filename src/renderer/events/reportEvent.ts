import * as Fathom from 'fathom-client';
import { eventIdLookup, FATHOM_SITE_ENV, FATHOM_SITE_ID } from './environment';
import { NNEvent } from './events';

/**
 * Enable or disable remote event reporting service from in the front-end.
 * NiceNode may still log events locally for future debugging purposes.
 */
export const setRemoteEventReportingEnabled = (isEnabled: boolean) => {
  console.log('setIsEventReportingEnabled: ', isEnabled);

  // Todo: Disable the annoying popup this throws
  if (isEnabled) {
    Fathom.enableTrackingForMe();
  } else {
    Fathom.blockTrackingForMe();
  }
  if (Fathom.isTrackingEnabled() !== isEnabled) {
    console.error(
      `Mismatch between user setting and event reporting service \
      setting. Service isEnabled:${Fathom.isTrackingEnabled()} and \
      user set isEnabled:${isEnabled}`,
    );
  }
};

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
    Fathom.load(fathomSiteId);
  } else {
    console.error('FATHOM_SITE_ID not found!');
  }
  console.log('process.env.FATHOM_SITE_ENV: ', FATHOM_SITE_ENV);
  console.log('Fathom track isEnabled?: ', Fathom.isTrackingEnabled());
};
initialize();
