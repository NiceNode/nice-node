// import { useTranslation } from 'react-i18next';

import { useCallback, useEffect, useState } from 'react';
// import { NodeStatus } from '../common/node';
import { setModalState } from '../../state/modal';
import electron from '../../electronGlobal';
// import { useGetNodesQuery } from './state/nodeService';
import { useAppSelector, useAppDispatch } from '../../state/hooks';
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
// import { useGetNetworkConnectedQuery } from './state/network';
import ContentSingleClient, {
  SingleNodeContent,
} from '../ContentSingleClient/ContentSingleClient';
import { hexToDecimal } from '../../utils';
import { NodeAction } from '../../Generics/redesign/consts';
import Button from '../../Generics/redesign/Button/Button';
import {
  container,
  contentContainer,
  titleFont,
  descriptionFont,
} from './NodeScreen.css';

let alphaModalRendered = false;

const NodeScreen = () => {
  // const { t } = useTranslation();
  const selectedNode = useAppSelector(selectSelectedNode);
  const qNodeVersion = useGetNodeVersionQuery(
    selectedNode?.spec.rpcTranslation
  );
  const [sIsSyncing, setIsSyncing] = useState<boolean>();
  const [sSyncPercent, setSyncPercent] = useState<string>('');
  const [sPeers, setPeers] = useState<number>();
  const [sHasSeenAlphaModal, setHasSeenAlphaModal] = useState<boolean>();
  const [sLatestBlockNumber, setLatestBlockNumber] = useState<number>();
  const sIsAvailableForPolling = useAppSelector(selectIsAvailableForPolling);
  const pollingInterval = sIsAvailableForPolling ? 15000 : 0;
  const qExecutionIsSyncing = useGetExecutionIsSyncingQuery(
    selectedNode?.spec.rpcTranslation,
    {
      pollingInterval,
    }
  );
  // const isSelectedNode = selectedNode !== undefined;
  // const peersPolling = isSelectedNode ? pollingInterval : 0;
  const qExecutionPeers = useGetExecutionPeersQuery(
    selectedNode?.spec.rpcTranslation,
    {
      pollingInterval,
    }
  );
  const qLatestBlock = useGetExecutionLatestBlockQuery(
    selectedNode?.spec.rpcTranslation,
    {
      pollingInterval,
    }
  );

  // use to show if internet is disconnected
  // const qNetwork = useGetNetworkConnectedQuery(null, {
  //   // Only polls network connection if there are exactly 0 peers
  //   pollingInterval: typeof sPeers === 'number' && sPeers === 0 ? 30000 : 0,
  // });

  const diskUsed =
    selectedNode?.runtime?.usage?.diskGBs?.toPrecision(2) ?? undefined;
  // eslint-disable-next-line eqeqeq
  // const isHttpEnabled =
  //   selectedNode?.config?.configValuesMap?.http &&
  //   ['Enabled', 'enabled', 'true', true, 1].includes(
  //     selectedNode?.config?.configValuesMap?.http
  //   );
  // todo: http apis

  useEffect(() => {
    if (!sIsAvailableForPolling) {
      // clear all node data when it becomes unavailable to get
      setSyncPercent('');
      setIsSyncing(undefined);
      setPeers(undefined);
      setLatestBlockNumber(undefined);
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
    }
    // else if (syncingData === false) {
    //   // light client geth, it is done syncing if data is false
    //   setSyncPercent('');
    //   setIsSyncing(false);
    // }
    else {
      setSyncPercent('');
      setIsSyncing(undefined);
    }
  }, [qExecutionIsSyncing]);

  useEffect(() => {
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
    if (qLatestBlock.isError) {
      setLatestBlockNumber(undefined);
      return;
    }
    if (
      qLatestBlock?.data?.number &&
      typeof qLatestBlock.data.number === 'string'
    ) {
      const latestBlockNum = hexToDecimal(qLatestBlock.data.number);
      setLatestBlockNumber(latestBlockNum);
    } else {
      setLatestBlockNumber(undefined);
    }
  }, [qLatestBlock]);

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
    [selectedNode]
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
      })
    );
    alphaModalRendered = true;
  }

  if (!selectedNode) {
    // if there is no node selected, prompt user to create a new node
    return (
      <div className={container}>
        <div className={contentContainer}>
          <div className={titleFont}>No active nodes</div>
          <div className={descriptionFont}>
            Add your first node and start verifying the validty of every block
            of your favourite blockchain. Running a node also helps others to
            download and update their copies.
          </div>
          <Button
            label="Add node"
            variant="icon-left"
            iconId="add"
            type="primary"
            onClick={() => {
              dispatch(
                setModalState({
                  isModalOpen: true,
                  screen: { route: 'addNode', type: 'modal' },
                })
              );
            }}
          />
        </div>
      </div>
    );
  }

  const { status, spec } = selectedNode;
  // todo: get node type, single or multi-service
  // parse node details from selectedNode => SingleNodeContent
  // todo: add stop/start ability?

  // TODO: make this more flexible for other client specs
  const formatSpec = (info: string | undefined) => {
    if (!info) {
      return '';
    }
    if (info.includes('BeaconNode')) {
      return 'Consensus Client — Ethereum Mainnet';
    }
    if (info.includes('Execution')) {
      return 'Execution Client — Ethereum Mainnet';
    }
    return info;
  };

  const formatVersion = (version: string | undefined, name: string) => {
    if (!version) {
      return '';
    }
    const capitalize = (s: string) =>
      (s && s[0].toUpperCase() + s.slice(1)) || '';

    let regex;
    switch (name) {
      case 'geth':
        regex = /Geth\/v(\d+\.\d+\.\d+)/;
        break;
      case 'erigon':
        regex = /(\d+\.\d+\.\d+)-dev/;
        break;
      case 'nethermind':
      case 'lighthouse':
        // eslint-disable-next-line no-useless-escape
        regex = new RegExp(`${capitalize(name)}\/v(\\d+\\.\\d+\\.\\d+)`);
        break;
      default:
        console.error(`Invalid software name: ${name}`);
        return '';
    }

    const match = version.match(regex);

    if (match) {
      const versionString = `v${match[1]}`;
      return versionString;
    }
    console.error(`No version number found for ${name}`);
  };

  const clientName = spec.specId.replace('-beacon', '');

  const nodeContent: SingleNodeContent = {
    nodeId: selectedNode.id,
    name: clientName,
    type: 'client',
    version: formatVersion(qNodeVersion?.currentData, clientName),
    info: formatSpec(spec.category),
    status: {
      stopped: status === 'stopped',
      error: status.includes('error'),
      sychronized: !sIsSyncing && parseFloat(sSyncPercent) > 99.9,
    },
    stats: {
      peers: sPeers,
      currentBlock: sLatestBlockNumber,
      diskUsageGBs: diskUsed ? parseFloat(diskUsed) : undefined,
    },
    onAction: onNodeAction,
  };
  console.log('passing content to NodeScreen: ', nodeContent);
  return <ContentSingleClient {...nodeContent} />;

  // start button disabled logic
  // disabled={
  //   !(
  //     status === NodeStatus.created ||
  //     status === NodeStatus.readyToStart ||
  //     status === NodeStatus.errorStarting ||
  //     status === NodeStatus.errorRunning ||
  //     status === NodeStatus.stopped ||
  //     status === NodeStatus.errorStopping ||
  //     status === NodeStatus.unknown
  // stop button disabled logic
  //   disabled={status !== NodeStatus.running}
};
export default NodeScreen;
