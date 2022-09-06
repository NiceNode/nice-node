const ethereum = require('./ethereum.svg');
const ethereumValidator = require('./ethereum.svg');
const arbitrum = require('./ethereum.svg');
const healthy = require('./healthy.svg');
const warning = require('./warning.svg');
const error = require('./error.svg');
const sync = require('./sync.svg');

export interface NodeIcons {
  healthy?: string;
  warning?: string;
  error?: string;
  sync?: string;
  ethereum?: string;
  ethereumValidator?: string;
  arbitrum?: string;
}

// Define all icons here
export const NODE_ICONS: NodeIcons = {
  healthy,
  warning,
  error,
  sync,
  ethereum,
  ethereumValidator,
  arbitrum,
};
