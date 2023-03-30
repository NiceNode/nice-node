/* eslint-disable prefer-destructuring */
import { NNEvent } from './events';

// declares the type of the injected variable process from webpack plugin
declare let process: { env: Record<string, string> };
// do not destruct because webpack replaces exact string match to 'process.env.<var>'
export const FATHOM_SITE_ID = process.env.FATHOM_SITE_ID;
export const FATHOM_SITE_ENV = process.env.FATHOM_SITE_ENV as Envs;

type EventIdRecord = Record<NNEvent, string>;
type Envs = 'dev' | 'staging' | 'prod';

const envEvent: Record<Envs, EventIdRecord> = {
  dev: {
    AddNode: 'UETFB2BF',
    OpenApp: '03ZA5M3X',
    InstalledPodman: 'EF8NEAIC',
    OpenAddNodeModal: 'V7S4NG8K',
  },
  staging: {
    AddNode: 'UETFB2BF',
    OpenApp: '03ZA5M3X',
    InstalledPodman: 'EF8NEAIC',
    OpenAddNodeModal: 'V7S4NG8K',
  },
  prod: {
    AddNode: 'UETFB2BF',
    OpenApp: '03ZA5M3X',
    InstalledPodman: 'EF8NEAIC',
    OpenAddNodeModal: 'V7S4NG8K',
  },
};

const environment = 'dev';
export const eventIdLookup = (event: NNEvent): string => {
  let eventId = '';
  eventId = envEvent[environment][event];
  return eventId;
};
