export interface ClientStatusProps {
  synchronized: boolean;
  lowPeerCount: boolean;
  updateAvailable: boolean;
  blocksBehind: boolean;
  noConnection: boolean;
  stopped: boolean;
  error: boolean;
}

export interface SyncStatusProps {
  INITIALIZING: string;
  CATCHING_UP: string;
  SYNCHRONIZED: string;
  LOW_PEER_COUNT: string;
  NO_NETWORK: string;
  STOPPED: string;
}

export const SYNC_STATUS = Object.freeze({
  INITIALIZING: 'initializing',
  CATCHING_UP: 'catchingUp',
  SYNCHRONIZED: 'synchronized',
  LOW_PEER_COUNT: 'lowPeerCount',
  NO_NETWORK: 'noNetwork',
  STOPPED: 'stopped',
});
