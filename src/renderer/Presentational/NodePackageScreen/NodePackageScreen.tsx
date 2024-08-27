// import { useTranslation } from 'react-i18next';

import { useCallback, useEffect, useState } from 'react';
// import { NodeStatus } from '../common/node';
import { useTranslation } from 'react-i18next';
import { NodeStatus } from '../../../common/node.js';
import Button from '../../Generics/redesign/Button/Button';
import type { ClientProps, NodeAction } from '../../Generics/redesign/consts';
import { getStatusObject } from '../../Generics/redesign/utils.js';
import type { NodeBackgroundId } from '../../assets/images/nodeBackgrounds';
import electron from '../../electronGlobal';
// import { useGetNodesQuery } from './state/nodeService';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setModalState } from '../../state/modal';
import { useGetNetworkConnectedQuery } from '../../state/network';
import {
  selectIsAvailableForPolling,
  selectSelectedNodePackage,
  selectUserNodes,
} from '../../state/node';
import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionLatestBlockQuery,
  useGetExecutionPeersQuery,
} from '../../state/services';
import { useGetIsPodmanRunningQuery } from '../../state/settingsService';
import { hexToDecimal } from '../../utils';
import { getSyncData } from '../../utils.js';
import ContentMultipleClients from '../ContentMultipleClients/ContentMultipleClients';
import type { SingleNodeContent } from '../ContentSingleClient/ContentSingleClient';
import {
  container,
  contentContainer,
  descriptionFont,
  titleFont,
} from './NodePackageScreen.css';

let alphaModalRendered = false;

const NodePackageScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedNodePackage = useAppSelector(selectSelectedNodePackage);
  const sUserNodes = useAppSelector(selectUserNodes);
  const [sFormattedServices, setFormattedServices] = useState<ClientProps[]>(
    [],
  );
  const [sDiskUsed, setDiskUsed] = useState<number>(0);
  const [sCpuPercentUsed, setCpuPercentUsed] = useState<number>(0);
  const [sMemoryUsagePercent, setMemoryUsagePercent] = useState<number>(0);
  const [sHasSeenAlphaModal, setHasSeenAlphaModal] = useState<boolean>();
  const [sLatestBlockNumber, setLatestBlockNumber] = useState<number>(0);
  const [sNetworkNodePackage, setNetworkNodePackage] = useState<string>('');
  const sIsAvailableForPolling = useAppSelector(selectIsAvailableForPolling);
  // const pollingInterval = sIsAvailableForPolling ? 15000 : 0;
  const pollingInterval = 15000;

  const executionNode = selectedNodePackage?.services.find(
    (service) => service.serviceId !== 'consensusClient',
  );
  const consensusNode = selectedNodePackage?.services.find(
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
  const isEthereumNodePackage =
    selectedNodePackage?.spec?.specId === 'ethereum';
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
  const qConsensusPeers = useGetExecutionPeersQuery(
    { rpcTranslation: consensusRpcTranslation, httpPort: consensusHttpPort },
    { pollingInterval },
  );
  const qConsensusLatestBlock = useGetExecutionLatestBlockQuery(
    {
      rpcTranslation: consensusRpcTranslation,
      httpPort: consensusHttpPort,
    },
    { pollingInterval },
  );
  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: 15000,
  });
  const isPodmanRunning = !qIsPodmanRunning?.fetching && qIsPodmanRunning?.data;
  // temporary until network is set at the node package level
  const qNetwork = useGetNetworkConnectedQuery(null, {
    pollingInterval: 30000,
  });

  useEffect(() => {
    if (selectedNodePackage?.config?.configValuesMap?.network) {
      setNetworkNodePackage(
        selectedNodePackage?.config?.configValuesMap?.network,
      );
    } else {
      setNetworkNodePackage('');
    }
  }, [selectedNodePackage]);
  // use to show if internet is disconnected
  // const qNetwork = useGetNetworkConnectedQuery(null, {
  //   // Only polls network connection if there are exactly 0 peers
  //   pollingInterval: typeof sPeers === 'number' && sPeers === 0 ? 30000 : 0,
  // });

  // calc node package resource usage
  useEffect(() => {
    // format for presentation
    let diskUsedGBs = 0;
    let cpuPercent = 0;
    let memoryPercent = 0;
    selectedNodePackage?.services.map((service) => {
      const nodeId = service.node.id;
      const node = sUserNodes?.nodes[nodeId];
      diskUsedGBs += node?.runtime?.usage?.diskGBs?.[0]?.y ?? 0;
      cpuPercent += node?.runtime?.usage?.cpuPercent?.[0]?.y ?? 0;
      memoryPercent += node?.runtime?.usage?.memoryBytes?.[0]?.y ?? 0;
    });
    setDiskUsed(diskUsedGBs);
    setCpuPercentUsed(cpuPercent);
    setMemoryUsagePercent(memoryPercent);
  }, [selectedNodePackage?.services, sUserNodes]);

  useEffect(() => {
    const savedSyncedBlock =
      selectedNodePackage?.runtime?.usage?.syncedBlock || 0;
    if (qExecutionLatestBlock.isError) {
      setLatestBlockNumber(savedSyncedBlock);
      return;
    }

    const updateNodeLastSyncedBlock = async (latestBlockNum: number) => {
      if (!selectedNodePackage) {
        return;
      }
      await electron.updateNodeLastSyncedBlock(
        selectedNodePackage.id,
        latestBlockNum,
      );
    };

    const blockNumber = isEthereumNodePackage
      ? qExecutionLatestBlock?.data
      : qExecutionLatestBlock?.data?.number;
    const slotNumber = qExecutionLatestBlock?.data?.header?.message?.slot;
    const rpcTranslation = selectedNodePackage?.spec?.rpcTranslation;

    let latestBlockNum = 0;
    if (
      blockNumber &&
      typeof blockNumber === 'string' &&
      rpcTranslation === 'eth-l1'
    ) {
      latestBlockNum = hexToDecimal(blockNumber);
    } else if (
      slotNumber &&
      typeof slotNumber === 'string' &&
      rpcTranslation === 'eth-l1-beacon'
    ) {
      latestBlockNum = Number.parseFloat(slotNumber);
    }

    const syncedBlock =
      latestBlockNum > savedSyncedBlock ? latestBlockNum : savedSyncedBlock;
    setLatestBlockNumber(syncedBlock);
    updateNodeLastSyncedBlock(syncedBlock);
  }, [qExecutionLatestBlock, selectedNodePackage]);

  const onNodeAction = useCallback(
    (action: NodeAction) => {
      console.log('NodeAction for node: ', action, selectedNodePackage);
      if (selectedNodePackage) {
        if (action === 'start') {
          electron.startNode(selectedNodePackage.id);
        } else if (action === 'stop') {
          electron.stopNode(selectedNodePackage.id);
        } else if (action === 'logs') {
          // show logs
        } else if (action === 'settings') {
          // show settings
        }
      }
    },
    [selectedNodePackage],
  );

  useEffect(() => {
    const setAlphaModal = async () => {
      const hasSeenAlpha = await electron.getSetHasSeenAlphaModal();
      setHasSeenAlphaModal(hasSeenAlpha || false);
    };
    setAlphaModal();
  }, []);

  const getSyncDataForService = useCallback(
    (service: any) => {
      const isNotConsensusClient = service.serviceId !== 'consensusClient';
      const syncingQuery = isNotConsensusClient
        ? qExecutionIsSyncing
        : qConsensusIsSyncing;
      const peersQuery = isNotConsensusClient
        ? qExecutionPeers
        : qConsensusPeers;

      return getSyncData(
        syncingQuery,
        peersQuery,
        qNetwork.status === 'rejected',
        service.node.lastRunningTimestampMs,
        service.node.updateAvailable,
        service.node.initialSyncFinished,
      );
    },
    [
      qExecutionIsSyncing,
      qConsensusIsSyncing,
      qExecutionPeers,
      qConsensusPeers,
      qNetwork.status,
    ],
  );

  useEffect(() => {
    const formattedServices: ClientProps[] =
      selectedNodePackage?.services.map((service) => {
        const { id: nodeId, spec } = service.node;
        const node = sUserNodes?.nodes[nodeId];
        // support other non-ethereum services
        const isNotConsensusClient = service.serviceId !== 'consensusClient';
        const syncData = getSyncDataForService(service);

        const stats = isNotConsensusClient
          ? {
              currentBlock: qExecutionIsSyncing?.data?.currentBlock || 0,
              highestBlock: qExecutionIsSyncing?.data?.highestBlock || 0,
            }
          : {
              currentSlot: qConsensusIsSyncing?.data?.currentSlot || 0,
              highestSlot: qConsensusIsSyncing?.data?.highestSlot || 0,
            };
        console.log('nodeStatus', getStatusObject(node?.status, syncData));
        return {
          id: nodeId,
          iconUrl: spec.iconUrl,
          name: spec.specId,
          displayName: spec.displayName as NodeBackgroundId,
          version: '',
          nodeType: service.serviceName,
          serviceId: service.serviceId,
          status: getStatusObject(node?.status, syncData),
          stats,
          resources: spec.resources,
        };
      }) ?? [];
    setFormattedServices(formattedServices);
  }, [selectedNodePackage?.services, sUserNodes]);

  // Check and stop the NodePackage if all services are stopped
  useEffect(() => {
    const checkAndStopNodePackage = async () => {
      if (selectedNodePackage?.status === NodeStatus.running) {
        const allServicesStopped = selectedNodePackage.services.every(
          (service) => {
            const nodeId = service.node.id;
            const nodeStatus = sUserNodes?.nodes[nodeId]?.status;
            return nodeStatus === NodeStatus.stopped;
          },
        );
        if (allServicesStopped) {
          await electron.stopNodePackage(selectedNodePackage.id);
        }
      }
    };
    checkAndStopNodePackage();
  }, [selectedNodePackage, sUserNodes]);

  if (sHasSeenAlphaModal === false && !alphaModalRendered) {
    dispatch(
      setModalState({
        isModalOpen: true,
        screen: { route: 'alphaBuild', type: 'info' },
      }),
    );
    alphaModalRendered = true;
  }

  if (!selectedNodePackage) {
    // if there is no node selected, prompt user to create a new node
    return (
      <div className={container}>
        <div className={contentContainer}>
          <div className={titleFont}>{t('NoActiveNodes')}</div>
          <div className={descriptionFont}>{t('AddFirstNode')}</div>
          <Button
            label={t('AddNode')}
            variant="icon-left"
            iconId="add"
            type="primary"
            onClick={() => {
              dispatch(
                setModalState({
                  isModalOpen: true,
                  screen: { route: 'addNode', type: 'modal' },
                }),
              );
            }}
          />
        </div>
      </div>
    );
  }

  const { id, status, spec, lastRunningTimestampMs, initialSyncFinished } =
    selectedNodePackage;
  // console.log('nodePackageStatus', status);
  // todo: get node type, single or multi-service
  // parse node details from selectedNodePackage => SingleNodeContent
  // todo: add stop/start ability?

  // TODO: make this more flexible for other client specs
  const formatSpec = (info: string | undefined) =>
    info ? `${info} ${sNetworkNodePackage}` : sNetworkNodePackage || '';

  const clientName = spec.specId.replace('-beacon', '');

  const executionSyncData = executionNode
    ? getSyncDataForService(executionNode)
    : undefined;
  const consensusSyncData = consensusNode
    ? getSyncDataForService(consensusNode)
    : undefined;

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
    consensusSyncData?.isSyncing ||
    (isEthereumNodePackage && !isEthereumNodePackageSynced());

  const nodePackageSyncData = {
    ...executionSyncData,
    isSyncing: isNodePackageSyncing,
  };

  console.log('nodePackage1', qExecutionIsSyncing);
  console.log('nodePackage2', qConsensusIsSyncing);
  console.log('nodePackage3', nodePackageSyncData);

  if (
    nodePackageSyncData.isSyncing === false &&
    status === NodeStatus.running &&
    initialSyncFinished === undefined
  ) {
    electron.updateNodePackage(id, {
      initialSyncFinished: true,
    });
  }

  console.log('statusObject', getStatusObject(status, nodePackageSyncData));

  const nodePackageContent: SingleNodeContent = {
    nodeId: id,
    displayName: spec.displayName,
    name: clientName as NodeBackgroundId,
    iconUrl: spec.iconUrl,
    screenType: 'client',
    rpcTranslation: spec.rpcTranslation,
    info: formatSpec(spec.displayTagline),
    status: getStatusObject(status, nodePackageSyncData),
    stats: {
      peers: nodePackageSyncData.peers,
      currentBlock: sLatestBlockNumber,
      diskUsageGBs: sDiskUsed,
      memoryUsagePercent: sMemoryUsagePercent,
      cpuLoad: sCpuPercentUsed,
    },
    onAction: onNodeAction,
    description: spec.description,
    resources: spec.resources,
    documentation: spec.documentation,
  };

  console.log('nodePackageScreen', nodePackageContent.status);

  /**
   * export interface ClientStatusProps {
  updating?: boolean;
  initialized?: boolean; // initial initialization is done
  synchronized?: boolean; // constantly updated from checking current / height slot or block
  lowPeerCount?: boolean;
  updateAvailable?: boolean;
  blocksBehind?: boolean;
  noConnection?: boolean;
  stopped?: boolean;
  error?: boolean;
}

export interface ClientStatsProps {
  currentBlock?: number;
  highestBlock?: number;
  currentSlot?: number;
  highestSlot?: number;
  peers?: number;
  cpuLoad?: number;
  diskUsageGBs?: number;
  rewards?: number;
  balance?: number;
  stake?: number;
}

export interface ClientProps {
  name: NodeBackgroundId;
  version: string;
  nodeType: string;
  status: ClientStatusProps;
  stats: ClientStatsProps;
}
   */
  console.log('passing content to NodePackageScreen: ', nodePackageContent);

  // todo: use ContentMultiClient
  // return <ContentSingleClient {...nodeContent} />;

  if (!sFormattedServices) {
    return null;
  }

  return (
    <ContentMultipleClients
      clients={sFormattedServices}
      nodeContent={nodePackageContent}
      isPodmanRunning={isPodmanRunning}
    />
  );
};
export default NodePackageScreen;
