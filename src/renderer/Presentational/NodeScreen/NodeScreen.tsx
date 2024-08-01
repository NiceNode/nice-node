import { useTranslation } from 'react-i18next';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NodeStatus } from '../../../common/node';
import Button from '../../Generics/redesign/Button/Button';
import CopyButton from '../../Generics/redesign/CopyButton/CopyButton.js';
import { HeaderButton } from '../../Generics/redesign/HeaderButton/HeaderButton';
import type { NodeAction } from '../../Generics/redesign/consts';
import type { NodeBackgroundId } from '../../assets/images/nodeBackgrounds';
import electron from '../../electronGlobal';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setModalState } from '../../state/modal';
import {
  selectIsAvailableForPolling,
  selectSelectedNode,
} from '../../state/node';
import node from '../../state/node.js';
import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionLatestBlockQuery,
  useGetExecutionPeersQuery,
  useGetNodeVersionQuery,
} from '../../state/services';
import { useGetIsPodmanRunningQuery } from '../../state/settingsService';
import { hexToDecimal } from '../../utils';
import ContentSingleClient, {
  type SingleNodeContent,
} from '../ContentSingleClient/ContentSingleClient';
import { DevMode } from '../DevMode/DevMode.js';
import {
  backButtonContainer,
  container,
  contentContainer,
  descriptionFont,
  titleFont,
} from './NodeScreen.css';

let alphaModalRendered = false;

const NodeScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedNode = useAppSelector(selectSelectedNode);
  const qNodeVersion = useGetNodeVersionQuery(
    selectedNode?.spec.rpcTranslation,
  );
  const [sIsSyncing, setIsSyncing] = useState<boolean>();
  // we will bring this var back in the future
  const [sSyncPercent, setSyncPercent] = useState<string>('');
  const [sPeers, setPeers] = useState<number>();
  const [sFreeStorageGBs, setFreeStorageGBs] = useState<number>(0);
  const [sTotalDiskSize, setTotalDiskSize] = useState<number>(0);
  const [sHasSeenAlphaModal, setHasSeenAlphaModal] = useState<boolean>();
  const [sLatestBlockNumber, setLatestBlockNumber] = useState<number>(0);
  const sIsAvailableForPolling = useAppSelector(selectIsAvailableForPolling);
  const pollingInterval = sIsAvailableForPolling ? 15000 : 0;
  const qExecutionIsSyncing = useGetExecutionIsSyncingQuery(
    {
      rpcTranslation: selectedNode?.spec.rpcTranslation,
      httpPort: selectedNode?.config?.configValuesMap?.httpPort,
    },
    {
      pollingInterval,
    },
  );
  // const isSelectedNode = selectedNode !== undefined;
  // const peersPolling = isSelectedNode ? pollingInterval : 0;
  const qExecutionPeers = useGetExecutionPeersQuery(
    {
      rpcTranslation: selectedNode?.spec.rpcTranslation,
      httpPort: selectedNode?.config?.configValuesMap?.httpPort,
    },
    {
      pollingInterval,
    },
  );
  const qLatestBlock = useGetExecutionLatestBlockQuery(
    {
      rpcTranslation: selectedNode?.spec.rpcTranslation,
      httpPort: selectedNode?.config?.configValuesMap?.httpPort,
    },
    {
      pollingInterval,
    },
  );
  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: 15000,
  });
  let isPodmanRunning = true;
  if (qIsPodmanRunning && !qIsPodmanRunning.fetching) {
    isPodmanRunning = qIsPodmanRunning.data;
  }

  // use to show if internet is disconnected
  // const qNetwork = useGetNetworkConnectedQuery(null, {
  //   // Only polls network connection if there are exactly 0 peers
  //   pollingInterval: typeof sPeers === 'number' && sPeers === 0 ? 30000 : 0,
  // });

  const diskUsed = selectedNode?.runtime?.usage?.diskGBs?.[0]?.y ?? 0;
  const cpuPercent = selectedNode?.runtime?.usage?.cpuPercent ?? [
    { x: 0, y: 0 },
  ];
  const memoryPercent = selectedNode?.runtime?.usage?.memoryBytes ?? [
    { x: 0, y: 0 },
  ];
  // const isHttpEnabled =
  //   selectedNode?.config?.configValuesMap?.http &&
  //   ['Enabled', 'enabled', 'true', true, 1].includes(
  //     selectedNode?.config?.configValuesMap?.http
  //   );
  // todo: http apis

  const getNodesDefaultStorageLocation = async () => {
    const defaultNodesStorageDetails =
      await electron.getNodesDefaultStorageLocation();
    setFreeStorageGBs(defaultNodesStorageDetails.freeStorageGBs);
  };

  useEffect(() => {
    getNodesDefaultStorageLocation();
    const interval = setInterval(getNodesDefaultStorageLocation, 15000);
    return () => clearInterval(interval);
  }, []);

  const getSystemSize = async () => {
    setTotalDiskSize(await electron.getSystemDiskSize());
  };

  useEffect(() => {
    getSystemSize();
  }, []);

  useEffect(() => {
    if (!sIsAvailableForPolling) {
      // clear all node data when it becomes unavailable to get
      setSyncPercent('');
      setIsSyncing(undefined);
      setPeers(undefined);
      setLatestBlockNumber(0);
    }
  }, [sIsAvailableForPolling]);

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
    } else if (syncingData === false) {
      // light client geth, it is done syncing if data is false
      setSyncPercent('');
      setIsSyncing(false);
    } else {
      setSyncPercent('');
      setIsSyncing(undefined);
    }
  }, [qExecutionIsSyncing]);

  useEffect(() => {
    console.log('qExecutionPeers: ', qExecutionPeers.data);
    if (qExecutionPeers.isError) {
      setPeers(undefined);
      return;
    }
    if (typeof qExecutionPeers.data === 'string') {
      setPeers(qExecutionPeers.data);
    } else if (typeof qExecutionPeers.data === 'number') {
      setPeers(qExecutionPeers.data.toString());
    } else {
      setPeers(undefined);
    }
  }, [qExecutionPeers]);

  useEffect(() => {
    const savedSyncedBlock = selectedNode?.runtime?.usage?.syncedBlock || 0;
    if (qLatestBlock.isError) {
      setLatestBlockNumber(savedSyncedBlock);
      return;
    }

    const updateNodeLSB = async (latestBlockNum: number) => {
      if (!selectedNode) {
        return;
      }
      await electron.updateNodeLastSyncedBlock(selectedNode.id, latestBlockNum);
    };

    const blockNumber = qLatestBlock?.data?.number;
    const slotNumber = qLatestBlock?.data?.header?.message?.slot;
    const rpcTranslation = selectedNode?.spec?.rpcTranslation;

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
    } else if (rpcTranslation === 'farcaster-l1') {
      latestBlockNum = qLatestBlock.data;
    }

    const syncedBlock =
      latestBlockNum > savedSyncedBlock ? latestBlockNum : savedSyncedBlock;
    setLatestBlockNumber(syncedBlock);
    updateNodeLSB(syncedBlock);
  }, [qLatestBlock, selectedNode]);

  const onNodeAction = useCallback(
    (action: NodeAction) => {
      console.log('NodeAction for node: ', action, selectedNode);
      if (selectedNode) {
        if (action === 'start') {
          electron.startNode(selectedNode.id);
        } else if (action === 'stop') {
          electron.stopNode(selectedNode.id);
        } else if (action === 'logs') {
          // show logs
        } else if (action === 'settings') {
          // show settings
        }
      }
    },
    [selectedNode],
  );

  useEffect(() => {
    const setAlphaModal = async () => {
      const hasSeenAlpha = await electron.getSetHasSeenAlphaModal();
      setHasSeenAlphaModal(hasSeenAlpha || false);
    };
    setAlphaModal();
  }, []);
  // useEffect(() => {
  //   qNodeInfo.refetch();
  // }, [selectedNode]);

  // Will select the Node with the given id, and will only rerender if the given Node data changes
  // https://redux-toolkit.js.org/rtk-query/usage/queries#selecting-data-from-a-query-result
  // const { selectedNode } = useGetNodesQuery(undefined, {
  //   selectFromResult: ({ data }: { data: Node[] }) => {
  //     return {
  //       selectedNode: data?.find((node) => node.id === sSelectedNodeId),
  //     };
  //   },
  // });
  const dispatch = useAppDispatch();

  if (sHasSeenAlphaModal === false && !alphaModalRendered) {
    dispatch(
      setModalState({
        isModalOpen: true,
        screen: { route: 'alphaBuild', type: 'info' },
      }),
    );
    alphaModalRendered = true;
  }

  if (!selectedNode) {
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

  const { status, spec } = selectedNode;

  // TODO: make this more flexible for other client specs
  const formatSpec = (info: string | undefined) => {
    if (!info) {
      return '';
    }
    if (info.includes('Consensus') || info.includes('BeaconNode')) {
      return 'Consensus Client';
    }
    if (info.includes('Execution')) {
      return 'Execution Client';
    }
    return info;
  };

  const formatVersion = (version: string | undefined) => {
    if (!version) {
      return t('IdentifyingVersion');
    }

    // At least, return the unformatted version string
    let versionString = version;

    // Don't match -stable or -<commit-hash> that many nodes use
    const genericVersionRegex = /v\d+\.\d+\.\d+(-[alpha|beta|edge]+)?(\.\d+)?/;
    const match = version.match(genericVersionRegex);

    if (match) {
      versionString = match[0];
    }

    return versionString;
  };

  const clientName = spec.specId.replace('-beacon', '');
  const nodeVersionData =
    typeof qNodeVersion === 'string' ? qNodeVersion : qNodeVersion?.currentData;

  const nodeContent: SingleNodeContent = {
    nodeId: selectedNode.id,
    displayName: selectedNode.spec.displayName,
    name: clientName as NodeBackgroundId,
    iconUrl: spec.iconUrl,
    screenType: 'client',
    rpcTranslation: spec.rpcTranslation,
    version: formatVersion(nodeVersionData),
    info: formatSpec(
      spec.category,
      // selectedNode?.config?.configValuesMap?.network ?? '',
    ),
    status: {
      stopped: status === NodeStatus.stopped,
      error: status.includes('error'),
      // Until sync percent is calculated accurately, just use the sync status returned from the
      //  node http api as the source of truth
      // synchronized: !sIsSyncing && parseFloat(sSyncPercent) > 99.9,
      synchronized: sIsSyncing === false && status === NodeStatus.running,
      updating: status === NodeStatus.updating,
      updateAvailable: selectedNode.updateAvailable,
    },
    stats: {
      peers: sPeers,
      currentBlock: sLatestBlockNumber,
      diskUsageGBs: diskUsed,
    },
    tabsData: {
      cpuPercent,
      memoryPercent,
      diskUsed: selectedNode?.runtime?.usage?.diskGBs,
      diskFree: sFreeStorageGBs,
      diskTotal: sTotalDiskSize,
    },
    onAction: onNodeAction,
    documentation: spec.documentation,
  };

  return (
    <>
      <div className={backButtonContainer}>
        <HeaderButton
          type="left"
          onClick={() => {
            navigate('/main/nodePackage');
          }}
        />
      </div>
      <ContentSingleClient
        nodeOverview={nodeContent}
        isPodmanRunning={isPodmanRunning}
      />
      <p>Controller version: {spec?.version}</p>
      <DevMode>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>Active Controller Json</span>
          <CopyButton data={JSON.stringify(selectedNode, null, 2)} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>Controller Config Json</span>
          <CopyButton data={JSON.stringify(selectedNode.config, null, 2)} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>Controller Json</span>
          <CopyButton data={JSON.stringify(selectedNode.spec, null, 2)} />
        </div>
      </DevMode>
    </>
  );
};
export default NodeScreen;
