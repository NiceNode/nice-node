import { useEffect, useState } from 'react';
import { type NodePackage, NodeStatus } from '../../../common/node';
import { SidebarNodeItem } from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { getStatusObject, getSyncStatus } from '../../Generics/redesign/utils';
import { useGetExecutionIsSyncingQuery } from '../../state/services';

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
  const [sIsSyncing, setIsSyncing] = useState<boolean>();
  const [sSyncPercent, setSyncPercent] = useState<string>('');

  const pollingInterval = 0;
  const qExecutionIsSyncing = useGetExecutionIsSyncingQuery(
    {
      rpcTranslation: node.spec.rpcTranslation,
      httpPort: node?.config?.configValuesMap?.httpPort,
    },
    {
      pollingInterval,
    },
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

  const syncData = {
    isSyncing: sIsSyncing,
    offline,
  };

  const nodeStatus = getStatusObject(status, syncData);
  const sidebarStatus = NODE_SIDEBAR_STATUS_MAP[getSyncStatus(nodeStatus)];

  return (
    <SidebarNodeItem
      // temp fix
      key={spec.specId || id}
      iconId={spec.specId?.replace('-beacon', '')}
      title={spec.displayName}
      info={node?.config?.configValuesMap?.network ?? 'Mainnet'}
      status={sidebarStatus}
      selected={selected}
      onClick={onClick}
    />
  );
};
