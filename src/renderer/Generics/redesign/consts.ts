import { NodeBackgroundId } from 'renderer/assets/images/nodeBackgrounds';

export interface ClientProps {
  name: NodeBackgroundId;
  version: string;
  nodeType: string;
  status: ClientStatusProps;
  stats: ClientStatsProps;
}

export interface NodeOverviewProps {
  name: NodeBackgroundId;
  title: string;
  info: string;
  type: string;
  version?: string;
  status: ClientStatusProps;
  stats: ClientStatsProps;
}

export interface ClientStatsProps {
  peers?: number;
  slots?: string;
  cpuLoad?: number;
  diskUsage?: number;
}

export interface ClientStatusProps {
  initialized: boolean; // initial initialization is done
  synchronizing: number; // currently synchronizing, update this constantly
  lowPeerCount: boolean;
  updateAvailable: boolean;
  blocksBehind: boolean; // is this redundant with synchronizing? consider deleting
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
