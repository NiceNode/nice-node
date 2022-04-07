import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { ethers } from '../ethers';

type CustomerErrorType = {
  message: string;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProviderResponse = any;

// const provider = new ethers.providers.WebSocketProvider('ws://localhost:8546');
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

// Define a service using a base URL and expected endpoints
// lots of issues in RTKQ github complaining about typescript breaking changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RtkqExecutionWs: any = createApi({
  reducerPath: 'RtkqExecutionWs',
  baseQuery: fakeBaseQuery<CustomerErrorType>(),
  endpoints: (builder) => ({
    getExecutionLatestBlock: builder.query<ProviderResponse, null>({
      queryFn: async () => {
        let data;
        try {
          data = await provider.getBlockNumber();
        } catch (e) {
          console.log(e);
        }
        return { data };
      },
    }),
    getExecutionBlock: builder.query<ProviderResponse, string>({
      queryFn: async (blockId) => {
        const block = await provider.getBlock(blockId);
        return { data: block };
      },
    }),
    getExecutionIsSyncing: builder.query<ProviderResponse, null>({
      queryFn: async () => {
        let data;
        try {
          data = await provider.send('eth_syncing');
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
    getExecutionPeers: builder.query<ProviderResponse, null>({
      queryFn: async () => {
        let data;
        // let error;
        try {
          data = await provider.send('net_peerCount');
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
  useGetExecutionBlockQuery,
  useGetExecutionIsSyncingQuery,
  useGetExecutionNetworkInfoQuery,
  useGetExecutionChainIdQuery,
  useGetExecutionPeersQuery,
} = RtkqExecutionWs;
