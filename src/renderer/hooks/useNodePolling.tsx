import { useEffect, useState } from 'react';
import { useNodeQueries } from './useNodeQueries';
import { getSyncData } from '../utils.js';

type NodePollingData = {
  qExecutionIsSyncing: any;
  qExecutionPeers: any;
  syncData: any;
};

export const useNodePolling = (
  rpcTranslation: string,
  httpPort: string,
  pollingInterval: number,
  qNetwork: any,
  lastRunningTimestampMs: number,
  updateAvailable: boolean,
  initialSyncFinished: boolean,
) => {
  const { qExecutionIsSyncing, qExecutionPeers } = useNodeQueries(
    rpcTranslation,
    httpPort,
    pollingInterval,
  );
  const [syncData, setSyncData] = useState(null);

  useEffect(() => {
    if (qExecutionIsSyncing && qExecutionPeers && qNetwork) {
      const syncData = getSyncData(
        qExecutionIsSyncing,
        qExecutionPeers,
        qNetwork,
        lastRunningTimestampMs,
        updateAvailable,
        initialSyncFinished,
      );
      setSyncData(syncData);
    }
  }, [
    qExecutionIsSyncing,
    qExecutionPeers,
    qNetwork,
    lastRunningTimestampMs,
    updateAvailable,
    initialSyncFinished,
  ]);

  return { qExecutionIsSyncing, qExecutionPeers, syncData };
};
