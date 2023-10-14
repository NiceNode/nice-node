// Execution
const geth = require('./Geth.png');
const erigon = require('./Erigon.png');
const besu = require('./Besu.png');
const nethermind = require('./Nethermind.png');
const reth = require('./Reth.png');

// Consensus
const prysm = require('./Prysm.png');
const lighthouse = require('./Lighthouse.png');
const teku = require('./Teku.png');
const lodestar = require('./Lodestar.png');
const nimbus = require('./Nimbus.png');

export interface NodeBackgrounds {
  geth?: string;
  erigon?: string;
  besu?: string;
  nethermind?: string;
  reth?: string;
  prysm?: string;
  lighthouse?: string;
  teku?: string;
  lodestar?: string;
  nimbus?: string;
  'op-geth'?: string;
  'op-node'?: string;
  hubble?: string;
  nitro?: string;
}

// Define all icons here
export const NODE_BACKGROUNDS: NodeBackgrounds = {
  geth,
  erigon,
  besu,
  nethermind,
  reth,
  prysm,
  lighthouse,
  teku,
  lodestar,
  nimbus,
  'op-geth': geth,
  'op-node': nimbus,
  hubble: lighthouse,
  nitro: teku,
};

export type NodeBackgroundId = keyof NodeBackgrounds;
