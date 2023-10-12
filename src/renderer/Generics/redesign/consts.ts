import { NodeBackgroundId } from 'renderer/assets/images/nodeBackgrounds';
import { NiceNodeRpcTranslation } from 'common/rpcTranslation';
import { NodeId } from 'common/node';

export interface ClientStatusProps {
  running?: boolean;
  updating?: boolean;
  initialized?: boolean; // initial initialization is done
  synchronized?: boolean; // constantly updated from checking current / height slot or block
  lowPeerCount?: boolean;
  updateAvailable?: boolean;
  blocksBehind?: boolean;
  noConnection?: boolean;
  online?: boolean;
  stopped?: boolean;
  error?: boolean;
}

export interface ClientStatsProps {
  currentBlock?: number;
  highestBlock?: number;
  currentSlot?: number;
  highestSlot?: number;
  peers?: number;
  cpuLoad?: number;
  diskUsageGBs?: number;
  memoryUsagePercent?: number;
  rewards?: number;
  balance?: number;
  stake?: number;
}

export interface ClientProps {
  id: NodeId;
  displayName: string;
  name: NodeBackgroundId | string;
  version: string;
  nodeType: string;
  status: ClientStatusProps;
  stats: ClientStatsProps;
  resources: any;
  onClick?: () => void;
}

export type NodeAction = 'start' | 'stop' | 'logs' | 'settings';
export interface NodeOverviewProps {
  name: NodeBackgroundId;
  displayName?: string;
  title: string;
  info: string;
  screenType: 'nodePackage' | 'client' | 'validator';
  rpcTranslation: NiceNodeRpcTranslation;
  version?: string;
  status: ClientStatusProps;
  stats: ClientStatsProps;
  onAction?: (action: NodeAction) => void;
  description?: string;
}

export interface SyncStatusProps {
  ERROR: string;
  INITIALIZING: string;
  CATCHING_UP: string;
  SYNCHRONIZED: string;
  LOW_PEER_COUNT: string;
  BLOCKS_BEHIND: string;
  NO_NETWORK: string;
  ONLINE: string;
  STOPPED: string;
}

export const SYNC_STATUS = Object.freeze({
  ERROR: 'error',
  UPDATING: 'updating',
  INITIALIZING: 'initializing',
  CATCHING_UP: 'catchingUp',
  SYNCHRONIZED: 'synchronized',
  LOW_PEER_COUNT: 'lowPeerCount',
  BLOCKS_BEHIND: 'blocksBehind',
  NO_NETWORK: 'noNetwork',
  ONLINE: 'online',
  STOPPED: 'stopped',
});
