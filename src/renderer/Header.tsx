import { useEffect, useState } from 'react';

import { ImWarning } from 'react-icons/im';
import { HiUserGroup } from 'react-icons/hi';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import { FaSync } from 'react-icons/fa';
import {
  MdSignalWifiStatusbarConnectedNoInternet,
  MdHttp,
} from 'react-icons/md';
import { FiHardDrive } from 'react-icons/fi';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { SiHiveBlockchain } from 'react-icons/si';
import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionLatestBlockQuery,
  useGetExecutionPeersQuery,
} from './state/services';
import { useGetNetworkConnectedQuery } from './state/network';
import { hexToDecimal } from './utils';
import { useAppSelector } from './state/hooks';
import {
  selectIsAvailableForPolling,
  selectNodeConfig,
  selectSelectedNode,
} from './state/node';

export const HEADER_HEIGHT = 48;

const Header = () => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const [sIsSyncing, setIsSyncing] = useState<boolean>();
  const [sSyncPercent, setSyncPercent] = useState<string>('');
  const [sPeers, setPeers] = useState<number>();
  const [sLatestBlockNumber, setLatestBlockNumber] = useState<number>();
  const sNodeConfig = useAppSelector(selectNodeConfig);
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
  const qNetwork = useGetNetworkConnectedQuery(null, {
    // Only polls network connection if there are exactly 0 peers
    pollingInterval: typeof sPeers === 'number' && sPeers === 0 ? 30000 : 0,
  });

  const diskUsed = selectedNode?.runtime?.usage?.diskGBs ?? undefined;
  // eslint-disable-next-line eqeqeq
  const isHttpEnabled =
    selectedNode?.config?.configValuesMap?.http &&
    ['Enabled', 'enabled', 'true', true, 1].includes(
      selectedNode?.config?.configValuesMap?.http
    );
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

  return (
    <div
      style={{
        height: HEADER_HEIGHT,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <div>
        <span style={{ fontSize: 24, fontWeight: 600 }}>NiceNode</span>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'end',
          fontSize: '1.1rem',
        }}
      >
        {!isHttpEnabled && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <ImWarning />
            <VscDebugDisconnect style={{ fontSize: '1.8rem' }} />
            <MdHttp style={{ fontSize: '2.5rem' }} />
          </div>
        )}
        {sNodeConfig?.syncMode === 'light' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <BsFillLightningChargeFill />
            <span>Light client</span>
          </div>
        )}
        {typeof sLatestBlockNumber === 'number' && sLatestBlockNumber > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <SiHiveBlockchain />
            <span style={{ marginLeft: 5, marginRight: 10 }}>
              {sLatestBlockNumber}
            </span>
          </div>
        )}
        {diskUsed !== undefined && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FiHardDrive />
            <span style={{ marginLeft: 5, marginRight: 10 }}>
              {diskUsed.toFixed(1)}GB
            </span>
          </div>
        )}
        {qNetwork?.data?.isConnected === false && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MdSignalWifiStatusbarConnectedNoInternet />
            <span style={{ marginLeft: 5, marginRight: 10 }}>
              check internet
            </span>
          </div>
        )}
        {/* {sIsSyncing !== false && ( */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <FaSync className={sIsSyncing ? 'spin' : ''} />
          <span style={{ marginLeft: 5, marginRight: 10 }}>
            {sSyncPercent}% synced
          </span>
        </div>
        {/* )} */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <HiUserGroup />
          <span style={{ marginLeft: 5, marginRight: 10 }}>{sPeers} peers</span>
        </div>
      </div>
    </div>
  );
};
export default Header;
