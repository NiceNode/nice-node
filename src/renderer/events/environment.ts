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
    AddNode: '',
    InstalledPodman: '',
    OpenAddNodeModal: '',
    OpenApp: '',
    UpdatedNiceNode: '',
    UserCheckForUpdateNN: '',
  },
  staging: {
    AddNode: '5FENDNLE',
    InstalledPodman: 'DFMJX8IS',
    OpenAddNodeModal: 'EQWPCKQL',
    OpenApp: 'XH4WYO0N',
    UpdatedNiceNode: 'XID0MV8O',
    UserCheckForUpdateNN: '5IOCU4Q3',
  },
  prod: {
    AddNode: 'ZFJ6BTDG',
    InstalledPodman: 'ZGDSVCN5',
    OpenAddNodeModal: 'J8FOMK6F',
    OpenApp: 'C0PWYWAO',
    UpdatedNiceNode: '4EGVSEAU',
    UserCheckForUpdateNN: '4TY1HDQG',
  },
};

export const eventIdLookup = (event: NNEvent): string => {
  let eventId = '';
  eventId = envEvent[FATHOM_SITE_ENV][event];
  return eventId;
};
