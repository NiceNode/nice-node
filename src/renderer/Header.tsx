import { useEffect, useState } from 'react';

import { HiUserGroup } from 'react-icons/hi';
import { FaSync } from 'react-icons/fa';
import { MdSignalWifiStatusbarConnectedNoInternet } from 'react-icons/md';
import { FiHardDrive } from 'react-icons/fi';
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
  selectNumGethDiskUsedGB,
  selectIsAvailableForPolling,
} from './state/node';

const Header = () => {
  const sGethDiskUsed = useAppSelector(selectNumGethDiskUsedGB);
  const [sIsSyncing, setIsSyncing] = useState<boolean>();
  const [sSyncPercent, setSyncPercent] = useState<string>('');
  const [sPeers, setPeers] = useState<number>();
  const [sLatestBlockNumber, setLatestBlockNumber] = useState<number>();
  const sIsAvailableForPolling = useAppSelector(selectIsAvailableForPolling);
  const pollingInterval = sIsAvailableForPolling ? 15000 : 0;
  const qExeuctionIsSyncing = useGetExecutionIsSyncingQuery(null, {
    pollingInterval,
  });
  const qExecutionPeers = useGetExecutionPeersQuery(null, {
    pollingInterval,
  });
  const qLatestBlock = useGetExecutionLatestBlockQuery(null, {
    pollingInterval,
  });
  const qNetwork = useGetNetworkConnectedQuery(null, {
    // Only polls network connection if there are exactly 0 peers
    pollingInterval: typeof sPeers === 'number' && sPeers === 0 ? 30000 : 0,
  });

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
    // console.log('qExeuctionIsSyncing: ', qExeuctionIsSyncing);
    if (qExeuctionIsSyncing.isError) {
      setSyncPercent('');
      setIsSyncing(undefined);
      return;
    }
    const syncingData = qExeuctionIsSyncing.data;
    if (typeof syncingData === 'object') {
      const syncRatio = syncingData.currentBlock / syncingData.highestBlock;
      setSyncPercent((syncRatio * 100).toFixed(1));
      setIsSyncing(true);
    } else if (syncingData === false) {
      // light client geth, it is done syncing if data is false
      setSyncPercent('');
      setIsSyncing(false);
    } else {
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
      setPeers(hexToDecimal(qExecutionPeers.data));
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
        height: 48,
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
        {sGethDiskUsed && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FiHardDrive />
            <span style={{ marginLeft: 5, marginRight: 10 }}>
              {sGethDiskUsed.toFixed(1)}GB
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
