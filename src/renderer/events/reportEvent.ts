import mixpanel from 'mixpanel-browser';

import { MP_PROJECT_ENV, MP_PROJECT_TOKEN } from './environment';
import { NNEvent } from './events';
import electron from '../electronGlobal';

let debugInfo: any;
const getDebugInfo = async (): Promise<any> => {
  if (debugInfo) return debugInfo;
  debugInfo = await electron.getDebugInfo();
  return debugInfo;
};
getDebugInfo();

/**
 * Enable or disable remote event reporting service from in the front-end.
 * NiceNode may still log events locally for future debugging purposes.
 */
export const setRemoteEventReportingEnabled = (isEnabled: boolean) => {
  console.log('setIsEventReportingEnabled: ', isEnabled);
  if (MP_PROJECT_ENV === 'dev') {
    console.log('No mp function to call because mixpanel is not initialized.');
    return;
  }

  if (isEnabled) {
    mixpanel.opt_in_tracking();
  } else {
    mixpanel.opt_out_tracking();
  }
  if (mixpanel.has_opted_in_tracking() !== isEnabled) {
    console.error(
      `Mismatch between user setting and event reporting service \
      setting. Service isEnabled:${mixpanel.has_opted_in_tracking()} and \
      user set isEnabled:${isEnabled}`,
    );
  }
};

export type ReportEventData = {
  [x: string]: string | number | boolean | string[] | any;
};
/**
 * Components should use this to report significant events. Events will be
 * logged or optionally sent to tracking service for core contributors to review.
 * @param event
 */
export const reportEvent = async (
  event: NNEvent,
  properties?: ReportEventData,
) => {
  console.log('reportEvent, properties: ', event, properties);
  if (MP_PROJECT_ENV === 'dev') {
    return;
  }
  const defaultProperties = await getDebugInfo();
  mixpanel.track(event, { eventData: properties, context: defaultProperties });
};

export const initialize = async () => {
  if (MP_PROJECT_ENV === 'dev') {
    return;
  }
  const mpProjectToken = MP_PROJECT_TOKEN;
  if (mpProjectToken) {
    mixpanel.init(mpProjectToken, {
      debug: true,
      track_pageview: true,
      persistence: 'localStorage',
    });
    const appClientId = await electron.getAppClientId();
    console.log('event reporting: appClientId: ', appClientId);
    mixpanel.identify(appClientId);
  } else {
    console.error('MP_PROJECT_TOKEN not found!');
  }
  console.log('process.env.MP_PROJECT_ENV: ', MP_PROJECT_ENV);
  // Initially, these are both false
  console.log(
    'Mixpanel track has_opted_in_tracking?: ',
    mixpanel.has_opted_in_tracking(),
  );
  console.log(
    'Mixpanel track has_opted_out_tracking?: ',
    mixpanel.has_opted_out_tracking(),
  );
};
initialize();
