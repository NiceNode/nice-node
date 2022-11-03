// import { useTranslation } from 'react-i18next';

import { useEffect, useState } from 'react';
// import { NodeStatus } from '../common/node';
// import electron from './electronGlobal';
// import { useGetNodesQuery } from './state/nodeService';
import { useAppSelector } from './state/hooks';
import { selectIsAvailableForPolling, selectSelectedNode } from './state/node';
import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionLatestBlockQuery,
  useGetExecutionPeersQuery,
  useGetNodeVersionQuery,
} from './state/services';
// import { useGetNetworkConnectedQuery } from './state/network';
import ContentSingleClient, {
  SingleNodeContent,
} from './Presentational/ContentSingleClient/ContentSingleClient';
import { hexToDecimal } from './utils';

const NodeScreen = () => {
  // const { t } = useTranslation();
  const selectedNode = useAppSelector(selectSelectedNode);
  const qNodeVersion = useGetNodeVersionQuery(
    selectedNode?.spec.rpcTranslation
  );
  const [sIsSyncing, setIsSyncing] = useState<boolean>();
  const [sSyncPercent, setSyncPercent] = useState<string>('');
  const [sPeers, setPeers] = useState<number>();
  const [sLatestBlockNumber, setLatestBlockNumber] = useState<number>();
  const sIsAvailableForPolling = useAppSelector(selectIsAvailableForPolling);
  const pollingInterval = sIsAvailableForPolling ? 15000 : 0;
  const qExeuctionIsSyncing = useGetExecutionIsSyncingQuery(
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
    console.log('qExeuctionIsSyncing: ', qExeuctionIsSyncing);
    if (qExeuctionIsSyncing.isError) {
      setSyncPercent('');
      setIsSyncing(undefined);
      return;
    }
    const syncingData = qExeuctionIsSyncing.data;
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
  }, [qExeuctionIsSyncing]);

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
  if (!selectedNode) {
    // if docker is not installed, show prompt
    // eslint-disable-next-line react/jsx-curly-brace-presence
    return <p>{'Get started! "Add a node"!'}</p>;
  }

  const { status, spec } = selectedNode;
  // todo: get node type, single or multi-service
  // parse node details from selectedNode => SingleNodeContent
  // todo: add stop/start ability?
  const nodeContent: SingleNodeContent = {
    nodeId: selectedNode.id,
    name: spec.specId.replace('-beacon', ''),
    type: 'client',
    version: qNodeVersion?.currentData,
    info: spec.category,
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
