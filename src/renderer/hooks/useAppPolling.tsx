import { useEffect } from 'react';
import { useGetNetworkConnectedQuery } from '../state/network.js';
import { useGetIsPodmanRunningQuery } from '../state/settingsService.js';

type AppPollingData = {
  qNetwork: any;
  qIsPodmanRunning: any;
};

export const useAppPolling = (
  networkPollingInterval: number,
  podmanPollingInterval: number,
) => {
  const qNetwork = useGetNetworkConnectedQuery(null, {
    pollingInterval: networkPollingInterval,
  });
  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: podmanPollingInterval,
  });

  return { qNetwork, qIsPodmanRunning };
};
