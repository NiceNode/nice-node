import { NodeStatus } from '../../../common/node.js';
import { type ClientStatusProps, SYNC_STATUS } from './consts';

export const getStatusObject = (
  status: NodeStatus = NodeStatus.unknown,
  syncData: {
    isSyncing: boolean;
    peers: number;
    minutesPassedSinceLastRun: number;
    offline: boolean;
    updateAvailable: boolean;
    initialSyncFinished: boolean;
  },
) => {
  console.log('Status in getStatusObject:', status);
  // console.log('SyncData in getStatusObject:', syncData);

  return {
    [SYNC_STATUS.REMOVING]: status === NodeStatus.removing,
    [SYNC_STATUS.STARTING]:
      status === NodeStatus.starting || status === NodeStatus.created,
    [SYNC_STATUS.RUNNING]: status === NodeStatus.running,
    [SYNC_STATUS.STOPPING]: status === NodeStatus.stopping,
    [SYNC_STATUS.STOPPED]: status === NodeStatus.stopped,
    [SYNC_STATUS.UPDATING]: status === NodeStatus.updating,
    updateAvailable: syncData?.updateAvailable,
    [SYNC_STATUS.ERROR]: status.includes('error'),
    [SYNC_STATUS.SYNCHRONIZED]:
      syncData?.isSyncing === false && status === NodeStatus.running,
    [SYNC_STATUS.LOW_PEER_COUNT]:
      syncData?.peers < 5 &&
      syncData?.minutesPassedSinceLastRun > 20 &&
      status === NodeStatus.running,
    [SYNC_STATUS.NO_CONNECTION]:
      syncData?.offline &&
      (status === NodeStatus.running || status === 'error starting'),
    [SYNC_STATUS.CATCHING_UP]:
      syncData?.isSyncing === true &&
      status === NodeStatus.running &&
      syncData?.initialSyncFinished,
    // initialized: status === NodeStatus.initialized,
    // blocksBehind: status === NodeStatus.blocksBehind,
  };
};

export const getSyncStatus = (status: ClientStatusProps) => {
  let syncStatus;
  // console.log('getSyncStatus', status);
  switch (true) {
    // find worst cases first
    case status.error:
      syncStatus = SYNC_STATUS.ERROR;
      break;
    case status.noConnection:
      syncStatus = SYNC_STATUS.NO_CONNECTION;
      break;
    case status.lowPeerCount:
      syncStatus = SYNC_STATUS.LOW_PEER_COUNT;
      break;
    case status.removing:
      syncStatus = SYNC_STATUS.REMOVING;
      break;
    case status.updating:
      syncStatus = SYNC_STATUS.UPDATING;
      break;
    case status.catchingUp:
      syncStatus = SYNC_STATUS.CATCHING_UP;
      break;
    case status.starting:
      syncStatus = SYNC_STATUS.STARTING;
      break;
    case status.stopping:
      syncStatus = SYNC_STATUS.STOPPING;
      break;
    case status.stopped:
      syncStatus = SYNC_STATUS.STOPPED;
      break;
    case status.online:
      syncStatus = SYNC_STATUS.ONLINE;
      break;
    case status.blocksBehind:
      syncStatus = SYNC_STATUS.BLOCKS_BEHIND;
      break;
    case status.synchronized:
      syncStatus = SYNC_STATUS.SYNCHRONIZED;
      break;
    case status.running:
      syncStatus = SYNC_STATUS.INITIALIZING;
      break;
    default:
      syncStatus = SYNC_STATUS.STARTING;
      break;
  }
  // console.log('syncStatus', syncStatus);
  return syncStatus;
};
