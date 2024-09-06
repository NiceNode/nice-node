import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { NiceNodeRpcTranslation } from '../../common/rpcTranslation';
import { ethers } from '../ethers';
import { executeTranslation } from './rpcExecuteTranslation';

type CustomerErrorType = {
  message: string;
};
type ProviderResponse = any;

type QueryArg = {
  rpcTranslation: NiceNodeRpcTranslation;
  httpPort: string;
  url?: string;
  specId?: string;
};

// const provider = new ethers.providers.WebSocketProvider('ws://localhost:8546');
// const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
// const provider9545 = new ethers.providers.JsonRpcProvider(
//   'http://localhost:9545'
// );
// const provider9545 =
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8547');

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
export const RtkqExecutionWs: any = createApi({
  reducerPath: 'RtkqExecutionWs',
  baseQuery: fakeBaseQuery<CustomerErrorType>(),
  endpoints: (builder) => ({
    getExecutionLatestBlock: builder.query<ProviderResponse, QueryArg>({
      queryFn: async ({ rpcTranslation, httpPort, url = undefined }) => {
        let data;
        // stop remote execution query IF not Ethereum node, we need a cleaner way to do this
        if (rpcTranslation !== 'eth-l1' && url) {
          return undefined;
        }
        try {
          // data = await provider.send('eth_getBlockByNumber', ['latest', false]);
          console.log('latestBlock rpcTranslation', rpcTranslation);
          data = await executeTranslation({
            rpcCall: 'latestBlock',
            rpcTranslation,
            httpPort,
            url,
          });
          console.log('latestBlock data', data);
        } catch (e) {
          const error = { message: 'Unable to get latestBlock value' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getExecutionIsSyncing: builder.query<ProviderResponse, QueryArg>({
      queryFn: async ({ rpcTranslation, httpPort, specId = undefined }) => {
        let data;
        console.log('rpcTranslation!', rpcTranslation);
        console.log('httpPort!', httpPort);
        console.log('specIdpassed', specId);
        try {
          // if (!rpcTranslation.sync) {
          //   console.log('No rpcTranslation found for sync');
          // }
          // data = await provider.send('eth_syncing');
          console.log('sync rpcTranslation', rpcTranslation);
          data = await executeTranslation({
            rpcCall: 'sync',
            rpcTranslation,
            httpPort,
            specId,
          });
          console.log('sync data', data);
        } catch (e) {
          const error = { message: 'Unable to get syncing value' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getExecutionNetworkInfo: builder.query<ProviderResponse, null>({
      queryFn: async () => {
        const network = await provider.getNetwork();
        return { data: network };
      },
    }),
    getNodeVersion: builder.query<ProviderResponse, QueryArg>({
      queryFn: async ({ rpcTranslation, httpPort }) => {
        let data;
        try {
          console.log('clientVersion rpcTranslation', rpcTranslation);
          data = await executeTranslation({
            rpcCall: 'clientVersion',
            rpcTranslation,
            httpPort,
          });
          console.log('clientVersion data', data);
        } catch (e) {
          const error = { message: 'Unable to get node version.' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
    getExecutionPeers: builder.query<ProviderResponse, QueryArg>({
      queryFn: async ({ rpcTranslation, httpPort }) => {
        let data;
        // let error;
        try {
          console.log('peers rpcTranslation', rpcTranslation);
          data = await executeTranslation({
            rpcCall: 'peers',
            rpcTranslation,
            httpPort,
          });
          console.log('peers data', data);

          // data = await provider.send('net_peerCount');
        } catch (e) {
          const error = { message: 'Unable to get peer count.' };
          console.log(e);
          return { error };
        }
        return { data };
      },
    }),
  }),
});

export const {
  useGetExecutionLatestBlockQuery,
  useGetExecutionIsSyncingQuery,
  useGetExecutionNetworkInfoQuery,
  useGetNodeVersionQuery,
  useGetExecutionChainIdQuery,
  useGetExecutionPeersQuery,
} = RtkqExecutionWs;
