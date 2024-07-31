import { useEffect, useState } from 'react';
import moment from 'moment';
import { type NodePackage, NodeStatus } from '../../../common/node';
import { SidebarNodeItem } from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { getStatusObject, getSyncStatus } from '../../Generics/redesign/utils';
import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionPeersQuery,
} from '../../state/services';
import { useGetNetworkConnectedQuery } from '../../state/network';

export type SidebarNodeStatus =
  | 'healthy'
  | 'warning'
  | 'error'
  | 'sync'
  | 'stopped'
  | 'updating';

const NODE_SIDEBAR_STATUS_MAP: Record<string, SidebarNodeStatus> = {
  created: 'stopped',
  initializing: 'sync',
  [NodeStatus.checkingForUpdates]: 'updating',
  downloading: 'updating',
  downloaded: 'stopped',
  [NodeStatus.errorDownloading]: 'error',
  updating: 'updating',
  extracting: 'updating',
  [NodeStatus.readyToStart]: 'stopped',
  starting: 'sync',
  running: 'sync',
  stopping: 'sync',
  stopped: 'stopped',
  [NodeStatus.noConnection]: 'error',
  [NodeStatus.errorRunning]: 'error',
  [NodeStatus.errorStarting]: 'error',
  [NodeStatus.errorStopping]: 'error',
  catchingUp: 'sync',
  unknown: 'error',
  error: 'error',
};

export interface SidebarNodeItemWrapperProps {
  /**
   * Which icon?
   */
  id?: string;
  /**
   * What's the status?
   */
  status?: SidebarNodeStatus;
  offline?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Is the node selected?
   */
  selected?: boolean;
  node: NodePackage;
}

export const SidebarNodeItemWrapper = ({
  onClick,
  selected,
  id,
  node,
  offline,
}: SidebarNodeItemWrapperProps) => {
  const pollingInterval = 0;
  const qExecutionIsSyncing = useGetExecutionIsSyncingQuery(
    {
      rpcTranslation: node?.spec.rpcTranslation,
      httpPort: node?.config?.configValuesMap?.httpPort,
    },
    { pollingInterval },
  );
  const qExecutionPeers = useGetExecutionPeersQuery(
    {
      rpcTranslation: node?.spec.rpcTranslation,
      httpPort: node?.config?.configValuesMap?.httpPort,
    },
    { pollingInterval },
  );

  const { spec, status } = node;

  const isSyncing = qExecutionIsSyncing.isError
    ? undefined
    : qExecutionIsSyncing?.data?.isSyncing;
  const peers = qExecutionPeers.isError
    ? undefined
    : typeof qExecutionPeers.data === 'number'
      ? qExecutionPeers.data
      : typeof qExecutionPeers.data === 'string'
        ? Number.parseInt(qExecutionPeers.data, 10) || 0
        : 0;
  const now = moment();
  const minutesPassedSinceLastRun = now.diff(
    moment(node?.lastRunningTimestampMs),
    'minutes',
  );

  const syncData = {
    isSyncing,
    peers,
    updateAvailable: node.updateAvailable,
    minutesPassedSinceLastRun,
    offline,
    initialSyncFinished: node?.initialSyncFinished || false,
  };

  const nodeStatus = getStatusObject(status, syncData);
  const sidebarStatus = NODE_SIDEBAR_STATUS_MAP[getSyncStatus(nodeStatus)];

  return (
    <SidebarNodeItem
      // temp fix
      key={spec.specId || id}
      iconId={spec.specId?.replace('-beacon', '')}
      title={spec.displayName}
      iconUrl={spec.iconUrl}
      info={node?.config?.configValuesMap?.network ?? 'Mainnet'}
      status={sidebarStatus}
      selected={selected}
      onClick={onClick}
    />
  );
};
