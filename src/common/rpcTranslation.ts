// NodeSpecification.rpcTranslation?: 'eth-l1' | 'eth-l1-beacon' | object;

export type RpcTranslation = {
  request: {
    method: 'GET' | 'POST';
    urlPath: string;
    message?: any;
    protocol?: 'http' | 'ws';
  };
  response: {
    value: string;
    path: string;
  }[];
};

// export type NiceNodeRpcTranslation = {
//   peerCount?: RpcTranslation;
//   sync?: RpcTranslation;
// };

export type NiceNodeRpcTranslation =
  | 'eth-l1'
  | 'eth-l1-beacon'
  | 'eth-l2-op-stack'
  | 'eth-l2-starknet'
  | 'eth-l2-arbitrum'
  | 'eth-l2-consensus'
  | 'farcaster-l1'
  | 'minecraft-server';
// | {
//     peerCount?: RpcTranslation;
//     sync?: RpcTranslation;
//   };

// export const BeaconNodeRpcTranslation: NiceNodeRpcTranslation = {
//   peerCount: {
//     request: {
//       method: 'GET',
//       urlPath: '/eth/v1/node/peer_count',
//     },
//     response: [
//       {
//         value: 'peerCount',
//         path: 'data.connected',
//       },
//     ],
//   },
//   sync: {
//     request: {
//       method: 'GET',
//       urlPath: '/eth/v1/node/syncing',
//     },
//     response: [
//       {
//         value: 'isSyncing',
//         path: 'data.is_syncing',
//       },
//     ],
//   },
// };

// export const ExecutionNodeRpcTranslation: NiceNodeRpcTranslation = {
//   peerCount: {
//     request: {
//       method: 'POST',
//       urlPath: '/',
//       message: { method: 'net_peerCount', params: [], jsonrpc: '2.0' },
//     },
//     response: [
//       {
//         value: 'peerCount',
//         path: 'result',
//       },
//     ],
//   },
//   sync: {
//     request: {
//       method: 'POST',
//       urlPath: '/',
//       message: { method: 'eth_syncing', params: [], jsonrpc: '2.0' },
//     },
//     response: [
//       {
//         value: 'isSyncing',
//         path: 'result.isSyncing',
//       },
//       {
//         value: 'currentBlock',
//         path: 'result.currentBlock',
//       },
//       {
//         value: 'highestBlock',
//         path: 'result.highestBlock',
//       },
//     ],
//   },
// };
