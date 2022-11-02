import { ClientStatusProps, SYNC_STATUS } from './consts';

export const getSyncStatus = (status: ClientStatusProps) => {
  let syncStatus = null;
  switch (true) {
    // find worst cases first
    case status.updating:
      syncStatus = SYNC_STATUS.UPDATING;
      break;
    case status.stopped:
      syncStatus = SYNC_STATUS.STOPPED;
      break;
    case status.noConnection:
      syncStatus = SYNC_STATUS.NO_NETWORK;
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
      break;
  }
  return syncStatus;
};
