import { useEffect, useState } from 'react';

import { HiUserGroup } from 'react-icons/hi';
import { FaSync } from 'react-icons/fa';
import { MdSignalWifiStatusbarConnectedNoInternet } from 'react-icons/md';

import {
  useGetExecutionIsSyncingQuery,
  useGetExecutionPeersQuery,
} from './state/services';
import { useGetNetworkConnectedQuery } from './state/network';
import { hexToDecimal } from './utils';

const Header = () => {
  const [sSyncPercent, setSyncPercent] = useState<string>('');
  const [sPeers, setPeers] = useState<number>();
  const qExeuctionIsSyncing = useGetExecutionIsSyncingQuery(null, {
    pollingInterval: 15000,
  });
  const qExecutionPeers = useGetExecutionPeersQuery(null, {
    pollingInterval: 15000,
  });
  const qNetwork = useGetNetworkConnectedQuery(null, {
    // Only polls network connection if there are exactly 0 peers
    pollingInterval: typeof sPeers === 'number' && sPeers === 0 ? 30000 : 0,
  });

  useEffect(() => {
    console.log('qExeuctionIsSyncing.data: ', qExeuctionIsSyncing.data);
    const syncingData = qExeuctionIsSyncing.data;
    console.log('curr sync: ', syncingData);
    if (typeof syncingData === 'object') {
      const syncRatio = syncingData.currentBlock / syncingData.highestBlock;
      setSyncPercent((syncRatio * 100).toFixed(1));
    } else {
      setSyncPercent('');
    }
  }, [qExeuctionIsSyncing]);

  useEffect(() => {
    console.log('qExecutionPeers.data: ', qExecutionPeers.data);
    if (typeof qExecutionPeers.data === 'string') {
      setPeers(hexToDecimal(qExecutionPeers.data));
    } else {
      setPeers(undefined);
    }
  }, [qExecutionPeers]);

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
        }}
      >
        {qNetwork?.data?.isConnected === false && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignContent: 'center',
            }}
          >
            <MdSignalWifiStatusbarConnectedNoInternet />
            <span style={{ marginLeft: 5, marginRight: 10 }}>
              check internet
            </span>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
          }}
        >
          <FaSync />
          <span style={{ marginLeft: 5, marginRight: 10 }}>
            {sSyncPercent}% synced
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
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
