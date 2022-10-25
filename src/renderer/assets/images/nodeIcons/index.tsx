import { common } from '../../../Generics/redesign/theme.css';

const ethereum = require('./Logo-Ethereum.png');

// Execution
const geth = require('./Logo-Geth.png');
const erigon = require('./Logo-Erigon.png');
const besu = require('./Logo-Besu.png');
const nethermind = require('./Logo-Nethermind.png');

// Consensus
const prysm = require('./Logo-Prysm.png');
const lighthouse = require('./Logo-Lighthouse.png');
const teku = require('./Logo-Teku.png');
const lodestar = require('./Logo-Lodestar.png');
const nimbus = require('./Logo-Nimbus.png');

// L2
const arbitrum = require('./Logo-Arbitrum.png');
const starknet = require('./Logo-Starknet.png');
const zkSync = require('./Logo-zkSync.png');

// Other networks
const radicle = require('./Logo-Radicle.png');
const livepeer = require('./Logo-Livepeer.png');

export interface NodeIcons {
  geth?: string;
  erigon?: string;
  besu?: string;
  nethermind?: string;
  prysm?: string;
  lighthouse?: string;
  teku?: string;
  lodestar?: string;
  nimbus?: string;
  ethereum?: string;
  arbitrum?: string;
  starknet?: string;
  zkSync?: string;
  radicle?: string;
  livepeer?: string;
}

// Define all icons here
export const NODE_ICONS: NodeIcons = {
  geth,
  erigon,
  besu,
  nethermind,
  prysm,
  lighthouse,
  teku,
  lodestar,
  nimbus,
  ethereum,
  arbitrum,
  starknet,
  zkSync,
  radicle,
  livepeer,
};

const white = '#FFFFFF';

export const NODE_COLORS: NodeIcons = {
  geth: white,
  erigon: white,
  besu: white,
  nethermind: white,
  prysm: white,
  lighthouse: white,
  teku: white,
  lodestar: white,
  nimbus: white,
  ethereum: common.color.ethereum,
  arbitrum: common.color.arbitrum,
  starknet: common.color.starknet,
  zkSync: common.color.zkSync,
  radicle: common.color.radicle,
  livepeer: common.color.livepeer,
};

export type NodeIconId = keyof NodeIcons;
