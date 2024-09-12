import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../Generics/redesign/Button/Button';
import CopyButton from '../../Generics/redesign/CopyButton/CopyButton.js';
import { HeaderButton } from '../../Generics/redesign/HeaderButton/HeaderButton';
import type { NodeAction } from '../../Generics/redesign/consts';
import { getStatusObject } from '../../Generics/redesign/utils.js';
import type { NodeBackgroundId } from '../../assets/images/nodeBackgrounds';
import electron from '../../electronGlobal';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setModalState } from '../../state/modal';
import { useGetNetworkConnectedQuery } from '../../state/network';
import {
  selectIsAvailableForPolling,
  selectSelectedNode,
} from '../../state/node';
import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionLatestBlockQuery,
  useGetExecutionPeersQuery,
  useGetNodeVersionQuery,
} from '../../state/services';
import { useGetIsPodmanRunningQuery } from '../../state/settingsService';
import { hexToDecimal } from '../../utils';
import { getSyncData } from '../../utils.js';
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
  const dispatch = useAppDispatch();
  const selectedNode = useAppSelector(selectSelectedNode);
  const sIsAvailableForPolling = useAppSelector(selectIsAvailableForPolling);

  const [sFreeStorageGBs, setFreeStorageGBs] = useState<number>(0);
  const [sTotalDiskSize, setTotalDiskSize] = useState<number>(0);
  const [sHasSeenAlphaModal, setHasSeenAlphaModal] = useState<boolean>();
  const [sLatestBlockNumber, setLatestBlockNumber] = useState<number>(
    selectedNode?.runtime?.usage?.syncedBlock || 0,
  );

  const pollingInterval = sIsAvailableForPolling ? 15000 : 0;

  const qNodeVersion = useGetNodeVersionQuery(
    {
      rpcTranslation: selectedNode?.spec.rpcTranslation,
      httpPort: selectedNode?.config?.configValuesMap?.httpPort,
    },
    { pollingInterval }, //TODO: modify this to stop once we know version
  );
  const qExecutionIsSyncing = useGetExecutionIsSyncingQuery(
    {
      rpcTranslation: selectedNode?.spec.rpcTranslation,
      httpPort: selectedNode?.config?.configValuesMap?.httpPort,
      specId: selectedNode?.spec.specId,
    },
    { pollingInterval },
  );
  // const isSelectedNode = selectedNode !== undefined;
  // const peersPolling = isSelectedNode ? pollingInterval : 0;
  const qExecutionPeers = useGetExecutionPeersQuery(
    {
      rpcTranslation: selectedNode?.spec.rpcTranslation,
      httpPort: selectedNode?.config?.configValuesMap?.httpPort,
      specId: selectedNode?.spec.specId,
    },
    { pollingInterval },
  );
  const qNetwork = useGetNetworkConnectedQuery(null, {
    pollingInterval: 30000,
  });
  const qLatestBlock = useGetExecutionLatestBlockQuery(
    {
      rpcTranslation: selectedNode?.spec.rpcTranslation,
      httpPort: selectedNode?.config?.configValuesMap?.httpPort,
      specId: selectedNode?.spec.specId,
    },
    { pollingInterval },
  );
  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: 15000,
  });
  const isPodmanRunning = !qIsPodmanRunning?.fetching && qIsPodmanRunning?.data;

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

  useEffect(() => {
    const getNodesDefaultStorageLocation = async () => {
      const defaultNodesStorageDetails =
        await electron.getNodesDefaultStorageLocation();
      setFreeStorageGBs(defaultNodesStorageDetails.freeStorageGBs);
    };
    getNodesDefaultStorageLocation();
    const interval = setInterval(getNodesDefaultStorageLocation, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    electron.getSystemDiskSize().then(setTotalDiskSize);
  }, []);

  useEffect(() => {
    const savedSyncedBlock = selectedNode?.runtime?.usage?.syncedBlock || 0;
    if (qLatestBlock.isError) {
      setLatestBlockNumber(savedSyncedBlock);
      return;
    }

    const updateNodeLSB = async (latestBlockNum: number) => {
      if (!selectedNode) return;
      await electron.updateNodeLastSyncedBlock(selectedNode.id, latestBlockNum);
    };

    const currentBlock =
      qExecutionIsSyncing?.data?.currentBlock ||
      qExecutionIsSyncing?.data?.currentSlot;

    let latestBlockNum = 0;

    if (typeof currentBlock === 'string') {
      latestBlockNum =
        currentBlock.slice(0, 2) === '0x'
          ? hexToDecimal(currentBlock)
          : Number.parseFloat(currentBlock);
    } else if (typeof currentBlock === 'number') {
      latestBlockNum = currentBlock;
    }
    if (selectedNode?.spec?.rpcTranslation === 'farcaster-l1') {
      latestBlockNum = qLatestBlock.data;
    }

    const syncedBlock =
      latestBlockNum > savedSyncedBlock ? latestBlockNum : savedSyncedBlock;
    setLatestBlockNumber(syncedBlock);
    updateNodeLSB(syncedBlock);
  }, [qExecutionIsSyncing, qLatestBlock, selectedNode]);

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

  //TODO: save existing node version data so that users can see even when node is stopped?
  const nodeVersionData =
    typeof qNodeVersion === 'string' ? qNodeVersion : qNodeVersion?.currentData;

  const syncData = getSyncData(
    qExecutionIsSyncing,
    qExecutionPeers,
    qNetwork.status === 'rejected',
    selectedNode?.lastRunningTimestampMs,
    selectedNode.updateAvailable,
    selectedNode?.initialSyncFinished,
  );

  // console.log('singleNodeStatus', status);
  const statusObject = getStatusObject(status, syncData);
  console.log('statusObject', statusObject);
  const nodeContent: SingleNodeContent = {
    nodeId: selectedNode.id,
    displayName: selectedNode.spec.displayName,
    name: clientName as NodeBackgroundId,
    iconUrl: spec.iconUrl,
    screenType: 'client',
    rpcTranslation: spec.rpcTranslation,
    version: statusObject.stopped ? '' : formatVersion(nodeVersionData),
    info: formatSpec(
      spec.category,
      // selectedNode?.config?.configValuesMap?.network ?? '',
    ),
    status: statusObject,
    stats: {
      peers: syncData.peers,
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
      <DevMode>
        <p>Controller version: {spec?.version}</p>
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
