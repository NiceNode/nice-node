const ethereum = require('./Logo-Ethereum.png');

// Execution
const besu = require('./Logo-Besu.png');
const nethermind = require('./Logo-Nethermind.png');

// Consensus
const lodestar = require('./Logo-Lodestar.png');
const nimbus = require('./Logo-Nimbus.png');

// L2
const arbitrum = require('./Logo-Arbitrum.png');
const starknet = require('./Logo-Starknet.png');
const zkSync = require('./Logo-Starknet.png');

// Other networks
const radicle = require('./Logo-Radicle.png');
const livepeer = require('./Logo-Livepeer.png');

// Status
const healthy = require('./healthy.svg');
const warning = require('./warning.svg');
const error = require('./error.svg');
const sync = require('./sync.svg');

export interface NodeIcons {
  ethereum?: string;
  besu?: string;
  nethermind?: string;
  lodestar?: string;
  nimbus?: string;
  arbitrum?: string;
  starknet?: string;
  zkSync?: string;
  radicle?: string;
  livepeer?: string;
}

export interface NodeStatus {
  healthy?: string;
  warning?: string;
  error?: string;
  sync?: string;
}

// Define all icons here
export const NODE_ICONS: NodeIcons = {
  ethereum,
  besu,
  nethermind,
  lodestar,
  nimbus,
  arbitrum,
  starknet,
  zkSync,
  radicle,
  livepeer,
};

// Replace soon with CSS
export const NODE_STATUS: NodeStatus = {
  healthy,
  warning,
  error,
  sync,
};

export const NODE_COLORS: NodeIcons = {
  ethereum: '#6DA3F9',
  besu: '#FFFFFF',
  nethermind: '#FFFFFF',
  lodestar: '#FFFFFF',
  nimbus: '#FFFFFF',
  arbitrum: '#28A0F0',
  starknet: '#373795',
  zkSync: '#8C8DFC',
  radicle: '#B17CD9',
  livepeer: '#28CD88',
};

export type IconId = keyof NodeIcons;
