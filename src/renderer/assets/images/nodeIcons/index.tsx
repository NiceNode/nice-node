import { common } from '../../../Generics/redesign/theme.css';

import ethereum from './Logo-Ethereum.png';

// Execution
import besu from './Logo-Besu.png';
import erigon from './Logo-Erigon.png';
import geth from './Logo-Geth.png';
import nethermind from './Logo-Nethermind.png';
import reth from './Logo-Reth.png';

import lighthouse from './Logo-Lighthouse.png';
import lodestar from './Logo-Lodestar.png';
import nimbus from './Logo-Nimbus.png';
// Consensus
import prysm from './Logo-Prysm.png';
import teku from './Logo-Teku.png';

import arbitrum from './Logo-Arbitrum.png';
import base from './Logo-Base.png';
import magi from './Logo-Magi.png';
// L2
import optimism from './Logo-Optimism.png';
import hildr from './Logo-OptimismJava.png';
import starknet from './Logo-Starknet.png';
import zkSync from './Logo-zkSync.png';

import farcaster from './Logo-Farcaster.png';
import livepeer from './Logo-Livepeer.png';
// Other networks
import radicle from './Logo-Radicle.png';

// Other node/server types
import minecraft from './Logo-Minecraft.png';

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
  'prysm-beacon'?: string;
  'lighthouse-beacon'?: string;
  'teku-beacon'?: string;
  'lodestar-beacon'?: string;
  'nimbus-beacon'?: string;
  ethereum?: string;
  optimism?: string;
  arbitrum?: string;
  base?: string;
  starknet?: string;
  zkSync?: string;
  radicle?: string;
  livepeer?: string;
  'op-geth'?: string;
  'op-node'?: string;
  hildr?: string;
  magi?: string;
  farcaster?: string;
  hubble?: string;
  nitro?: string;
  minecraft?: string;
  'itzg-minecraft'?: string;
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
  hildr,
  magi,
  farcaster,
  hubble: farcaster,
  nitro: arbitrum,
  minecraft,
  'itzg-minecraft': minecraft,
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
  hildr: common.color.optimism,
  magi: white,
  base: common.color.base,
  ethereum: common.color.ethereum,
  arbitrum: common.color.arbitrum,
  starknet: common.color.starknet,
  zkSync: common.color.zkSync,
  radicle: common.color.radicle,
  livepeer: common.color.livepeer,
  farcaster: common.color.farcaster,
  hubble: common.color.farcaster,
  nitro: common.color.arbitrum,
  minecraft: common.color.minecraft,
  'itzg-minecraft': common.color.minecraft,
};

export type NodeIconId = keyof NodeIcons;
