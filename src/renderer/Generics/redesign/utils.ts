import { type ClientStatusProps, SYNC_STATUS } from './consts';
import { NodeStatus } from '../../../common/node.js';

export const getStatusObject = (
  status: NodeStatus = NodeStatus.unknown,
  syncData: {
    isSyncing: boolean;
    peers: number;
    minutesPassedSinceLastRun: number;
  },
) => ({
  starting: status === NodeStatus.starting,
  running: status === NodeStatus.running,
  stopping: status === NodeStatus.stopping,
  stopped: status === NodeStatus.stopped,
  updating: status === NodeStatus.updating,
  error: status.includes('error'),
  synchronized: syncData?.isSyncing === false && status === NodeStatus.running,
  lowPeerCount: syncData?.peers < 5 && syncData?.minutesPassedSinceLastRun > 20,
  // initialized: status === NodeStatus.initialized,
  // blocksBehind: status === NodeStatus.blocksBehind,
  // catchingUp: status === NodeStatus.catchingUp,
  // noConnection: status === NodeStatus.noConnection,
});

export const getSyncStatus = (status: ClientStatusProps) => {
  let syncStatus;
  // console.log('getSyncStatus', status);
  switch (true) {
    // find worst cases first
    case status.error:
      syncStatus = SYNC_STATUS.ERROR;
      break;
    case status.updating:
      syncStatus = SYNC_STATUS.UPDATING;
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
    case status.noConnection:
      syncStatus = SYNC_STATUS.NO_NETWORK;
      break;
    case status.online:
      syncStatus = SYNC_STATUS.ONLINE;
      break;
    case status.blocksBehind:
      syncStatus = SYNC_STATUS.BLOCKS_BEHIND;
      break;
    case status.initialized && !status.synchronized && !status.blocksBehind:
      syncStatus = SYNC_STATUS.CATCHING_UP;
      break;
    case !status.initialized && !status.synchronized && !status.blocksBehind:
      syncStatus = SYNC_STATUS.INITIALIZING;
      break;
    case status.lowPeerCount:
      syncStatus = SYNC_STATUS.LOW_PEER_COUNT;
      break;
    case status.synchronized:
      syncStatus = SYNC_STATUS.SYNCHRONIZED;
      break;
    default:
      syncStatus = SYNC_STATUS.ERROR;
      break;
  }
  return syncStatus;
};
