import { useEffect, useState } from 'react';
import moment from 'moment';
import { type NodePackage, NodeStatus } from '../../../common/node';
import { SidebarNodeItem } from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { getStatusObject, getSyncStatus } from '../../Generics/redesign/utils';
import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionPeersQuery,
} from '../../state/services';
import { getSyncData } from '../../utils.js';

export type SidebarNodeStatus =
  | 'healthy'
  | 'warning'
  | 'error'
  | 'sync'
  | 'stopped'
  | 'updating';

const STATUS_HEALTHY: SidebarNodeStatus = 'healthy';
const STATUS_WARNING: SidebarNodeStatus = 'warning';
const STATUS_ERROR: SidebarNodeStatus = 'error';
const STATUS_SYNC: SidebarNodeStatus = 'sync';
const STATUS_STOPPED: SidebarNodeStatus = 'stopped';
const STATUS_UPDATING: SidebarNodeStatus = 'updating';

const NODE_SIDEBAR_STATUS_MAP: Record<string, SidebarNodeStatus> = {
  created: STATUS_STOPPED,
  initializing: STATUS_SYNC,
  [NodeStatus.checkingForUpdates]: STATUS_UPDATING,
  downloading: STATUS_UPDATING,
  downloaded: STATUS_STOPPED,
  [NodeStatus.errorDownloading]: STATUS_ERROR,
  updating: STATUS_UPDATING,
  extracting: STATUS_UPDATING,
  [NodeStatus.readyToStart]: STATUS_STOPPED,
  starting: STATUS_SYNC,
  running: STATUS_SYNC,
  stopping: STATUS_SYNC,
  stopped: STATUS_STOPPED,
  lowPeerCount: STATUS_WARNING,
  synchronized: STATUS_HEALTHY,
  noConnection: STATUS_ERROR,
  [NodeStatus.errorRunning]: STATUS_ERROR,
  [NodeStatus.errorStarting]: STATUS_ERROR,
  [NodeStatus.errorStopping]: STATUS_ERROR,
  catchingUp: STATUS_SYNC,
  unknown: STATUS_ERROR,
  error: STATUS_ERROR,
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

  const syncData = getSyncData(
    qExecutionIsSyncing,
    qExecutionPeers,
    offline,
    node?.lastRunningTimestampMs,
    node.updateAvailable,
    node?.initialSyncFinished,
  );

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
