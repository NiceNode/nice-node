// Execution
const geth = require('./Geth.png');
const erigon = require('./Erigon.png');
const besu = require('./Besu.png');
const nethermind = require('./Nethermind.png');

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
  prysm?: string;
  lighthouse?: string;
  teku?: string;
  lodestar?: string;
  nimbus?: string;
}

// Define all icons here
export const NODE_BACKGROUNDS: NodeBackgrounds = {
  geth,
  erigon,
  besu,
  nethermind,
  prysm,
  lighthouse,
  teku,
  lodestar,
  nimbus,
};

export type NodeBackgroundId = keyof NodeBackgrounds;
