/* eslint-disable prefer-destructuring */
import { NNEvent } from './events';

// declares the type of the injected variable process from webpack plugin
declare let process: { env: Record<string, string> };

type Envs = 'dev' | 'staging' | 'prod';
// do not destruct because webpack replaces exact string match to 'process.env.<var>'
export const FATHOM_SITE_ID = process.env.FATHOM_SITE_ID;
export const FATHOM_SITE_ENV: Envs =
  (process.env.FATHOM_SITE_ENV as Envs) || 'dev';

type EventIdRecord = Record<NNEvent, string>;

const envEvent: Record<Envs, EventIdRecord> = {
  dev: {
    AddNode: 'UETFB2BF',
    InstalledPodman: 'EF8NEAIC',
    OpenAddNodeModal: 'V7S4NG8K',
    OpenApp: '03ZA5M3X',
  },
  staging: {
    AddNode: 'T1LEWHGY',
    InstalledPodman: 'EQGFLK5H',
    OpenAddNodeModal: 'EJHGTXNC',
    OpenApp: 'OFXHZEAX',
  },
  prod: {
    AddNode: 'UTGUO1JU',
    InstalledPodman: 'UVMEIFSC',
    OpenAddNodeModal: 'GTW5WHUI',
    OpenApp: '2BLFQCM7',
  },
};

export const eventIdLookup = (event: NNEvent): string => {
  let eventId = '';
  eventId = envEvent[FATHOM_SITE_ENV][event];
  return eventId;
};
