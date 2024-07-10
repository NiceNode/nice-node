import type { NodeId } from '../../../common/node';
import type { NiceNodeRpcTranslation } from '../../../common/rpcTranslation';
import type { NodeBackgroundId } from '../../../renderer/assets/images/nodeBackgrounds';

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
  packageName: string;
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
  documentation?: {
    default?: string;
    docker?: string;
    binary?: string;
    releaseNotesUrl?: string;
  };
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
  STOPPING: 'stopping',
  STARTING: 'starting',
});
