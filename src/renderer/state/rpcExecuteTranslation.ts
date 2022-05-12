/* eslint-disable no-else-return */
import { hexToDecimal } from '../utils';
import { ethers } from '../ethers';

// export const executeTranslation = async (
//   baseUrl: string,
//   rpcTranslation: RpcTranslation
// ) => {
//   const { request, response } = rpcTranslation;
//   const { urlPath, method, message } = request;
//   const fetchResponse = await fetch(baseUrl + urlPath, {
//     method,
//     body: message,
//   });
//   const returnValue
// };

const callFetch = async (apiRoute: string) => {
  const response = await fetch(apiRoute, {
    headers: {
      accept: 'application/json',
    },
    // mode: 'no-cors',
  });
  console.log(response);
  if (response) {
    // eslint-disable-next-line @typescript-eslint/return-await
    return await response.json();
  } else {
    return undefined;
  }
};

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

type RpcCall = 'sync' | 'peers' | 'latestBlock';
export const executeTranslation = async (
  rpcCall: RpcCall,
  rpcTranslation: string
): Promise<any> => {
  if (rpcTranslation === 'eth-l1') {
    // use provider
    if (rpcCall === 'sync') {
      const resp = await provider.send('eth_syncing');
      let isSyncing;
      let syncPercent;
      if (resp) {
        if (typeof resp === 'object') {
          const syncRatio = resp.currentBlock / resp.highestBlock;
          syncPercent = (syncRatio * 100).toFixed(1);
          isSyncing = true;
        } else if (resp === false) {
          // light client geth, it is done syncing if data is false
          isSyncing = false;
        }
      }
      return { isSyncing, syncPercent };
    } else if (rpcCall === 'peers') {
      const resp = await provider.send('net_peerCount');
      if (resp) {
        return hexToDecimal(resp);
      } else {
        return undefined;
      }
    } else if (rpcCall === 'latestBlock') {
      const resp = await provider.send('eth_getBlockByNumber', [
        'latest',
        false,
      ]);
      return resp;
    }
  } else if (rpcTranslation === 'eth-l2-beacon') {
    // call beacon api
    const beaconBaseUrl = 'http://localhost:5052';
    if (rpcCall === 'sync') {
      const resp = await callFetch(`${beaconBaseUrl}/eth/v1/node/syncing`);
      if (resp?.data?.is_syncing !== undefined) {
        let syncPercent;
        if (resp.data.is_syncing) {
          const syncRatio =
            parseInt(resp.data.head_slot, 10) /
            (parseInt(resp.data.sync_distance, 10) +
              parseInt(resp.data.head_slot, 10));
          syncPercent = (syncRatio * 100).toFixed(1);
        }

        return { isSyncing: resp.data.is_syncing, syncPercent };
      }
    } else if (rpcCall === 'peers') {
      const resp = await callFetch(`${beaconBaseUrl}/eth/v1/node/peer_count`);
      console.log('peers fetch resp ', resp);
      if (resp?.data?.connected !== undefined) {
        return resp.data.connected;
      }
    } else if (rpcCall === 'latestBlock') {
      const resp = await callFetch(
        `${beaconBaseUrl}​/eth​/v2​/beacon​/blocks​/head`
      );
      console.log('latestBlock fetch resp ', resp);
      if (resp?.data?.connected !== undefined) {
        return resp.data.connected;
      }
    }
  }
  return undefined;
};
