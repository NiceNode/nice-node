import moment from 'moment';
import { type NodePackage, NodeStatus } from '../../../common/node';
import { SidebarNodeItem } from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { getStatusObject, getSyncStatus } from '../../Generics/redesign/utils';
import { useAppContext } from '../../context/AppContext.js';

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
  const { getNodeData } = useAppContext();

  const lastRunningTimestampMs = node?.lastRunningTimestampMs;
  const updateAvailable = node?.updateAvailable;
  const initialSyncFinished = node?.initialSyncFinished;
  const pollingInterval = 0;

  const { spec, status, config } = node;
  const { syncData } = getNodeData({
    rpcTranslation: spec.rpcTranslation,
    httpPort: config.configValuesMap?.httpPort,
    pollingInterval,
    lastRunningTimestampMs,
    updateAvailable,
    initialSyncFinished,
  });

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
