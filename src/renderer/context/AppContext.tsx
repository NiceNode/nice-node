import React, { createContext, useContext, useMemo } from 'react';
import { useNodePolling } from '../hooks/useNodePolling.js';
import { useAppPolling } from '../hooks/useAppPolling.js';

type AppContextType = {
  getNodeData: (
    rpcTranslation: string,
    httpPort: string,
    pollingInterval: number,
    lastRunningTimestampMs: number,
    updateAvailable: boolean,
    initialSyncFinished: boolean,
  ) => {
    qExecutionIsSyncing: any;
    qExecutionPeers: any;
    syncData: any;
  };
  appData: {
    qNetwork: any;
    qIsPodmanRunning: any;
  };
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{
  children: React.ReactNode;
  appPollingIntervals: { network: number; podman: number };
}> = ({ children, appPollingIntervals }) => {
  const { network, podman } = appPollingIntervals;
  const appData = useAppPolling(network, podman);

  const value = useMemo(
    () => ({
      getNodeData: (
        rpcTranslation: string,
        httpPort: string,
        pollingInterval: number,
        lastRunningTimestampMs: number,
        updateAvailable: boolean,
        initialSyncFinished: boolean,
      ) => {
        const { qExecutionIsSyncing, qExecutionPeers, syncData } =
          useNodePolling(
            rpcTranslation,
            httpPort,
            pollingInterval,
            appData.qNetwork,
            lastRunningTimestampMs,
            updateAvailable,
            initialSyncFinished,
          );

        return {
          qExecutionIsSyncing,
          qExecutionPeers,
          syncData,
        };
      },
      appData,
    }),
    [appData],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
