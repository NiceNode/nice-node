import { useEffect, useState } from 'react';
import Node, { NodeStatus } from '../../../common/node';
import { getSyncStatus } from '../../Generics/redesign/utils';
import { useGetExecutionIsSyncingQuery } from '../../state/services';
import { SidebarNodeItem } from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';

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
  running: 'healthy',
  stopping: 'healthy',
  stopped: 'stopped',
  [NodeStatus.errorRunning]: 'error',
  [NodeStatus.errorStarting]: 'error',
  [NodeStatus.errorStopping]: 'error',
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
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Is the node selected?
   */
  selected?: boolean;
  node: Node;
}

export const SidebarNodeItemWrapper = ({
  onClick,
  selected,
  id,
  node,
}: SidebarNodeItemWrapperProps) => {
  const [sIsSyncing, setIsSyncing] = useState<boolean>();
  const [sSyncPercent, setSyncPercent] = useState<string>('');

  const pollingInterval = 0;
  const qExecutionIsSyncing = useGetExecutionIsSyncingQuery(
    node.spec.rpcTranslation,
    {
      pollingInterval,
    }
  );

  useEffect(() => {
    console.log('qExecutionIsSyncing: ', qExecutionIsSyncing);
    if (qExecutionIsSyncing.isError) {
      setSyncPercent('');
      setIsSyncing(undefined);
      return;
    }
    const syncingData = qExecutionIsSyncing.data;
    if (typeof syncingData === 'object') {
      setSyncPercent(syncingData.syncPercent);
      setIsSyncing(syncingData.isSyncing);
    } else {
      setSyncPercent('');
      setIsSyncing(undefined);
    }
  }, [qExecutionIsSyncing]);

  const { spec, status } = node;

  const nodeStatus = {
    stopped: status === 'stopped',
    error: status.includes('error'),
    sychronized: !sIsSyncing && parseFloat(sSyncPercent) > 99.9,
  };

  const syncStatus = getSyncStatus(nodeStatus);
  const sidebarStatus = NODE_SIDEBAR_STATUS_MAP[syncStatus];

  return (
    <SidebarNodeItem
      // temp fix
      key={id}
      iconId={spec.specId.replace('-beacon', '')}
      title={spec.displayName}
      info={spec.displayName}
      status={sidebarStatus}
      selected={selected}
      onClick={onClick}
    />
  );
};
