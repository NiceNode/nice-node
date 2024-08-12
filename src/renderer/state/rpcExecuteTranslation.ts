// biome-disable lint/style/noUselessElse: readability
import { ethers } from '../ethers';
import { callJsonRpc } from '../jsonRpcClient';
import { hexToDecimal } from '../utils';

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

/**
 * These calls do not get routed thru the webRequests in main
 *       request.mode = 'cors';
      request.cache = 'no-cache';
      request.credentials = 'same-origin';
      request.redirect = 'follow';
      request.referrer = 'client';
 */

const callFetch = async (apiRoute: string) => {
  const response = await fetch(apiRoute, {
    headers: {
      accept: 'application/json',
    },
    // mode: 'cors',
    cache: 'no-cache',
    // credentials: 'same-origin',
    redirect: 'follow',
    referrer: 'client',
    // mode: 'no-cors', // no-cors works with nimbus
  });
  console.log(response);
  if (response) {
    return response.json();
  }
  return undefined;
};

type RpcCall =
  | 'sync'
  | 'peers'
  | 'latestBlock'
  | 'clientVersion'
  | 'net_version'
  | 'metrics';
export const executeTranslation = async (
  rpcCall: RpcCall,
  rpcTranslation: string,
  httpPort: string,
  url?: string,
): Promise<any> => {
  const provider = new ethers.providers.JsonRpcProvider(
    url ? url : `http://localhost:${httpPort}`,
  );
  if (rpcTranslation === 'eth-l1') {
    // use provider
    if (rpcCall === 'sync') {
      const resp = await provider.send('eth_syncing');
      if (!resp) return { isSyncing: false, currentBlock: 0, highestBlock: 0 };

      const parsed = Object.fromEntries(
        Object.entries(resp).map(([key, value]) => {
          if (typeof value === 'number') {
            return [key, value];
          }
          if (typeof value === 'string') {
            return [key, Number.parseInt(value)];
          }
          return [key, undefined];
        }),
      );

      const highestBlock = parsed.highestBlock || 0;
      const currentBlock = parsed.currentBlock || 0;

      return {
        isSyncing: highestBlock - currentBlock < 30,
        currentBlock,
        highestBlock,
      };
    }
    if (rpcCall === 'peers') {
      const resp = await provider.send('net_peerCount');
      if (resp) {
        return hexToDecimal(resp);
      }
      return undefined;
    }
    if (rpcCall === 'latestBlock') {
      const resp = await provider.getBlockNumber();
      return resp;
    }
    if (rpcCall === 'clientVersion') {
      const resp = await provider.send('web3_clientVersion');
      if (resp) {
        return resp;
      }
      return undefined;
    }
  } else if (rpcTranslation === 'eth-l1-beacon') {
    // call beacon api
    const beaconBaseUrl = `http://localhost:${httpPort}`;
    if (rpcCall === 'sync') {
      const resp = await callFetch(`${beaconBaseUrl}/eth/v1/node/syncing`);
      if (!resp) return { isSyncing: false, currentSlot: 0, highestSlot: 0 };

      if (resp?.data) {
        const {
          is_syncing: isSyncing = false,
          head_slot: highestSlot = 0,
          sync_distance: syncDistance = 0,
        } = resp.data;

        const highestSlotNumber = Number(highestSlot);
        const syncDistanceNumber = Number(syncDistance);
        const currentSlot = highestSlotNumber - syncDistanceNumber;

        return {
          isSyncing,
          currentSlot,
          highestSlot: highestSlotNumber,
        };
      }
    } else if (rpcCall === 'peers') {
      const resp = await callFetch(`${beaconBaseUrl}/eth/v1/node/peer_count`);
      console.log('peers fetch resp ', resp);
      if (resp?.data?.connected !== undefined) {
        return resp.data.connected;
      }
    } else if (rpcCall === 'latestBlock') {
      const resp = await callFetch(
        `${beaconBaseUrl}/eth/v2/beacon/blocks/head`,
      );
      console.log('latestBlock fetch resp ', resp);
      if (resp?.data !== undefined) {
        return resp.data;
      }
    } else if (rpcCall === 'clientVersion') {
      const resp = await callFetch(`${beaconBaseUrl}/eth/v1/node/version`);
      if (resp?.data?.version !== undefined) {
        return resp.data.version;
      }
    }
  } else if (rpcTranslation === 'eth-l2') {
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
    }
    if (rpcCall === 'peers') {
      const resp = await provider.send('net_peerCount');
      if (resp) {
        return hexToDecimal(resp);
      }
      return undefined;
    }
    if (rpcCall === 'latestBlock') {
      const resp = await provider.send('eth_getBlockByNumber', [
        'latest',
        true,
      ]);
      return resp;
    }
    if (rpcCall === 'clientVersion') {
      const resp = await provider.send('web3_clientVersion');
      if (resp) {
        return resp;
      }
    } else if (rpcCall === 'net_version') {
      // Returns chain Id. Example 1=eth mainnet, 8453=base mainnet
      // we can use this to confirm that a node is running on the right network
      const resp = await provider.send('net_version');
      console.log('net_version: ', resp);
      if (resp) {
        return resp;
      }
      return undefined;
    }
  } else if (rpcTranslation === 'eth-l2-consensus') {
    // use provider
    if (rpcCall === 'sync') {
      const resp = await provider.send('eth_syncing');
      let isSyncing;
      let currentSlot;
      let highestSlot;
      if (resp) {
        if (typeof resp === 'object') {
          currentSlot = Number.parseInt(resp.currentSlot, 10);
          highestSlot = Number.parseInt(resp.highestSlot, 10);
          isSyncing = true;
        } else if (resp === false) {
          // light client geth, it is done syncing if data is false
          isSyncing = false;
        }
      }
      return { isSyncing, currentSlot, highestSlot };
    }
    if (rpcCall === 'peers') {
      const resp = await provider.send('net_peerCount');
      if (resp) {
        return hexToDecimal(resp);
      }
    } else if (rpcCall === 'latestBlock') {
      const resp = await provider.send('eth_getBlockByNumber', [
        'latest',
        true,
      ]);
      return resp;
    } else if (rpcCall === 'clientVersion') {
      const resp = await provider.send('web3_clientVersion');
      if (resp) {
        return resp;
      }
      return undefined;
    }
  } else if (rpcTranslation === 'farcaster-l1') {
    // todo: use the current config httpPort value instead of hardcoding 2281
    const hubbleBaseUrl = 'http://localhost:2281';
    if (rpcCall === 'sync') {
      const resp = await callFetch(`${hubbleBaseUrl}/v1/info`);
      if (resp && resp.isSyncing !== undefined) {
        return { isSyncing: resp.isSyncing };
      }
    } else if (rpcCall === 'clientVersion') {
      const resp = await callFetch(`${hubbleBaseUrl}/v1/info`);
      if (resp?.version !== undefined) {
        return `v${resp.version}`;
      }
    } else if (rpcCall === 'latestBlock') {
      const resp = await callFetch(`${hubbleBaseUrl}/v1/info?dbstats=1`);
      if (resp?.dbStats?.numMessages !== undefined) {
        return resp.dbStats.numMessages;
      }
    } else if (rpcCall === 'peers') {
      const resp = await callFetch(`${hubbleBaseUrl}/v1/info?dbstats=1`);
      if (resp?.dbStats?.numFidEvents !== undefined) {
        return resp.dbStats.numFidEvents;
      }
    }
  } else if (rpcTranslation === 'eth-l2-starknet') {
    console.log('rpcTranslation eth-l2-starknet: ');
    if (rpcCall === 'sync') {
      // const resp = await StarkNetClient.request('starknet_syncing', []);
      const resp = await callJsonRpc('starknet_syncing', []);
      // StarkNetClient.re
      console.log('starknet syncing resp: ', resp);
      // const resp = await callFetch(`${beaconBaseUrl}/eth/v1/node/syncing`);
      if (resp?.data?.is_syncing !== undefined) {
        let syncPercent;
        if (resp.data.is_syncing) {
          const syncRatio =
            Number.parseInt(resp.data.head_slot, 10) /
            (Number.parseInt(resp.data.sync_distance, 10) +
              Number.parseInt(resp.data.head_slot, 10));
          syncPercent = (syncRatio * 100).toFixed(1);
        }

        return { isSyncing: resp.data.is_syncing, syncPercent };
      }
    } else if (rpcCall === 'peers') {
      const resp = await callJsonRpc('starknet_net_peerCount', []);
      if (resp) {
        return hexToDecimal(resp);
      }
      return undefined;
    } else if (rpcCall === 'latestBlock') {
      const resp = await callJsonRpc('starknet_getBlockByNumber', [
        'latest',
        false,
      ]);
      return resp;
    } else if (rpcCall === 'clientVersion') {
      const resp = await callJsonRpc('web3_clientVersion', []);
      if (resp) {
        return resp;
      }
      return undefined;
    }
  }
  return undefined;
};
