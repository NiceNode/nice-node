import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionPeersQuery,
} from '../state/services.js';
import { useRef } from 'react';

export const useNodeQueries = (
  rpcTranslation: string,
  httpPort: string,
  pollingInterval: number,
) => {
  const isUnmounted = useRef(false);
  const qExecutionIsSyncing = useGetExecutionIsSyncingQuery(
    { rpcTranslation, httpPort },
    {
      pollingInterval,
      onSuccess: (data) => {
        console.log('qExecutionIsSyncing query successful', data);
      },
      onError: (error) => {
        console.log('qExecutionIsSyncing query error', error);
      },
      onSettled: () => {
        if (isUnmounted.current) {
          console.log('qExecutionIsSyncing polling stopped');
        } else {
          console.log('qExecutionIsSyncing polling running');
        }
      },
    },
  );
  const qExecutionPeers = useGetExecutionPeersQuery(
    { rpcTranslation, httpPort },
    { pollingInterval },
  );

  return { qExecutionIsSyncing, qExecutionPeers };
};
