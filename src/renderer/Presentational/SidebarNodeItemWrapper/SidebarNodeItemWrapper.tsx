import moment from 'moment';
import { useEffect, useState } from 'react';
import { type NodePackage, NodeStatus } from '../../../common/node';
import { SidebarNodeItem } from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { getStatusObject, getSyncStatus } from '../../Generics/redesign/utils';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  selectIsAvailableForPolling,
  selectSelectedNodePackage,
  selectUserNodes,
} from '../../state/node';
import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionPeersQuery,
  useGetExecutionLatestBlockQuery,
} from '../../state/services';
import { getSyncData } from '../../utils.js';

export type SidebarNodeStatus =
  | 'online'
  | 'warning'
  | 'error'
  | 'sync'
  | 'stopped'
  | 'updating';

const STATUS_ONLINE: SidebarNodeStatus = 'online';
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
  removing: STATUS_SYNC,
  stopped: STATUS_STOPPED,
  lowPeerCount: STATUS_WARNING,
  synchronized: STATUS_ONLINE,
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
  const sUserNodes = useAppSelector(selectUserNodes);
  const executionNode = node?.services.find(
    (service) => service.serviceId === 'executionClient',
  );
  const consensusNode = node?.services.find(
    (service) => service.serviceId === 'consensusClient',
  );
  const executionNodeId = executionNode?.node.id;
  const consensusNodeId = consensusNode?.node.id;
  const executionHttpPort =
    executionNodeId &&
    sUserNodes?.nodes[executionNodeId]?.config.configValuesMap.httpPort;
  const consensusHttpPort =
    consensusNodeId &&
    sUserNodes?.nodes[consensusNodeId]?.config.configValuesMap.httpPort;
  const isEthereumNodePackage = node?.spec?.specId === 'ethereum';
  const executionRpcTranslation = executionNode?.node?.spec?.rpcTranslation;
  const consensusRpcTranslation = consensusNode?.node?.spec?.rpcTranslation;
  const qPublicExecutionLatestBlock = useGetExecutionLatestBlockQuery(
    {
      rpcTranslation: executionRpcTranslation,
      httpPort: executionHttpPort,
      url: 'https://ethereum-rpc.publicnode.com',
    },
    { pollingInterval },
  );
  const qExecutionIsSyncing = useGetExecutionIsSyncingQuery(
    { rpcTranslation: executionRpcTranslation, httpPort: executionHttpPort },
    { pollingInterval },
  );
  const qExecutionPeers = useGetExecutionPeersQuery(
    { rpcTranslation: executionRpcTranslation, httpPort: executionHttpPort },
    { pollingInterval },
  );
  const qExecutionLatestBlock = useGetExecutionLatestBlockQuery(
    { rpcTranslation: executionRpcTranslation, httpPort: executionHttpPort },
    { pollingInterval },
  );
  const qConsensusIsSyncing = useGetExecutionIsSyncingQuery(
    {
      rpcTranslation: consensusRpcTranslation,
      httpPort: consensusHttpPort,
    },
    { pollingInterval },
  );
  const qConsensusLatestBlock = useGetExecutionLatestBlockQuery(
    {
      rpcTranslation: consensusRpcTranslation,
      httpPort: consensusHttpPort,
    },
    { pollingInterval },
  );

  const { spec, status, lastRunningTimestampMs, initialSyncFinished } = node;

  const executionSyncData = getSyncData(
    qExecutionIsSyncing,
    qExecutionPeers,
    offline,
    lastRunningTimestampMs,
    false,
    initialSyncFinished,
  );

  const consensusIsSyncing = qConsensusIsSyncing?.isError
    ? undefined
    : qConsensusIsSyncing?.data?.isSyncing || false;

  const isEthereumNodePackageSynced = () => {
    const isSynced = (
      executionBlockNumber: number,
      otherBlockNumber: number,
    ) => {
      return Math.abs(executionBlockNumber - otherBlockNumber) < 120; // ~30 minutes of blocks, should be fairly close to be considered synced
    };
    const executionLatestBlockNumber = qExecutionLatestBlock?.data;
    return (
      // Check if the execution block is close to the execution block contained within the consensus block
      isSynced(
        executionLatestBlockNumber,
        qConsensusLatestBlock?.data?.message?.body?.execution_payload
          ?.block_number,
      ) ||
      // If not, check if our execution block number is close to the public node that is already synced
      isSynced(executionLatestBlockNumber, qPublicExecutionLatestBlock?.data)
    );
  };

  const isNodePackageSyncing =
    executionSyncData?.isSyncing ||
    consensusIsSyncing ||
    (isEthereumNodePackage && !isEthereumNodePackageSynced());

  const nodePackageSyncData = {
    ...executionSyncData,
    isSyncing: isNodePackageSyncing,
  };

  const nodeStatus = getStatusObject(status, nodePackageSyncData);
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
