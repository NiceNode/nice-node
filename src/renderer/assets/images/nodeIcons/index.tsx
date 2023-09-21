import { common } from '../../../Generics/redesign/theme.css';

const ethereum = require('./Logo-Ethereum.png');

// Execution
const geth = require('./Logo-Geth.png');
const erigon = require('./Logo-Erigon.png');
const besu = require('./Logo-Besu.png');
const nethermind = require('./Logo-Nethermind.png');
const reth = require('./Logo-Reth.png');

// Consensus
const prysm = require('./Logo-Prysm.png');
const lighthouse = require('./Logo-Lighthouse.png');
const teku = require('./Logo-Teku.png');
const lodestar = require('./Logo-Lodestar.png');
const nimbus = require('./Logo-Nimbus.png');

// L2
const optimism = require('./Logo-Optimism.png');
const arbitrum = require('./Logo-Arbitrum.png');
const base = require('./Logo-Base.png');
const starknet = require('./Logo-Starknet.png');
const zkSync = require('./Logo-zkSync.png');

// Other networks
const radicle = require('./Logo-Radicle.png');
const livepeer = require('./Logo-Livepeer.png');
const farcaster = require('./Logo-Farcaster.png');

export interface NodeIcons {
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
  ['prysm-beacon']?: string;
  ['lighthouse-beacon']?: string;
  ['teku-beacon']?: string;
  ['lodestar-beacon']?: string;
  ['nimbus-beacon']?: string;
  ethereum?: string;
  optimism?: string;
  arbitrum?: string;
  base?: string;
  starknet?: string;
  zkSync?: string;
  radicle?: string;
  livepeer?: string;
  ['op-geth']?: string;
  ['op-node']?: string;
  farcaster?: string;
  hubble?: string;
}

// Define all icons here
export const NODE_ICONS: NodeIcons = {
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
  'prysm-beacon': prysm,
  'lighthouse-beacon': lighthouse,
  'teku-beacon': teku,
  'lodestar-beacon': lodestar,
  'nimbus-beacon': nimbus,
  ethereum,
  optimism,
  arbitrum,
  base,
  starknet,
  zkSync,
  radicle,
  livepeer,
  'op-geth': optimism,
  'op-node': optimism,
  farcaster,
  hubble: farcaster,
};

const white = '#FFFFFF';

export const NODE_COLORS: NodeIcons = {
  geth: white,
  erigon: white,
  besu: white,
  nethermind: white,
  reth: white,
  prysm: white,
  lighthouse: white,
  teku: white,
  lodestar: white,
  nimbus: white,
  'prysm-beacon': white,
  'lighthouse-beacon': white,
  'teku-beacon': white,
  'lodestar-beacon': white,
  'nimbus-beacon': white,
  optimism: common.color.optimism,
  'op-geth': common.color.optimism,
  'op-node': common.color.optimism,
  base: common.color.base,
  ethereum: common.color.ethereum,
  arbitrum: common.color.arbitrum,
  starknet: common.color.starknet,
  zkSync: common.color.zkSync,
  radicle: common.color.radicle,
  livepeer: common.color.livepeer,
  farcaster: common.color.farcaster,
  hubble: common.color.farcaster,
};

export type NodeIconId = keyof NodeIcons;
