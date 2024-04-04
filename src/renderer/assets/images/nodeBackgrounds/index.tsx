// Execution
import geth from './Geth.png';
import erigon from './Erigon.png';
import besu from './Besu.png';
import nethermind from './Nethermind.png';
import reth from './Reth.png';

// Consensus
import prysm from './Prysm.png';
import lighthouse from './Lighthouse.png';
import teku from './Teku.png';
import lodestar from './Lodestar.png';
import nimbus from './Nimbus.png';

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
  hildr?: string;
  magi?: string;
  hubble?: string;
  nitro?: string;
  'itzg-minecraft'?: string;
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
  hildr: nimbus,
  magi: nethermind,
  hubble: lighthouse,
  nitro: teku,
  'itzg-minecraft': geth,
};

export type NodeBackgroundId = keyof NodeBackgrounds;
