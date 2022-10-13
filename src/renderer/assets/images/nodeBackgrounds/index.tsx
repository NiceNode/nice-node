// const ethereum = require('./Logo-Ethereum.png');

// Execution
// const geth = require('./Logo-Geth.png');
// const erigon = require('./Logo-Erigon.png');
const besu = require('./Besu.png');
// const nethermind = require('./Logo-Nethermind.png');

// Consensus
// const prysm = require('./Logo-Prysm.png');
// const lighthouse = require('./Logo-Lighthouse.png');
// const teku = require('./Logo-Teku.png');
// const lodestar = require('./Logo-Lodestar.png');
const nimbus = require('./Nimbus.png');

// L2
// const arbitrum = require('./Logo-Arbitrum.png');
// const starknet = require('./Logo-Starknet.png');
// const zkSync = require('./Logo-zkSync.png');

export interface NodeBackgrounds {
  // geth?: string;
  // erigon?: string;
  besu?: string;
  // nethermind?: string;
  // prysm?: string;
  // lighthouse?: string;
  // teku?: string;
  // lodestar?: string;
  nimbus?: string;
  // ethereum?: string;
  // arbitrum?: string;
  // starknet?: string;
  // zkSync?: string;
  // radicle?: string;
  // livepeer?: string;
}

// Define all icons here
export const NODE_BACKGROUNDS: NodeBackgrounds = {
  // geth,
  // erigon,
  besu,
  // nethermind,
  // prysm,
  // lighthouse,
  // teku,
  // lodestar,
  nimbus,
  // ethereum,
  // arbitrum,
  // starknet,
  // zkSync,
  // radicle,
  // livepeer,
};

export type NodeBackgroundId = keyof NodeBackgrounds;
