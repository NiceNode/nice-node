const argent = require('./argent.png');
const brave = require('./brave.png');
const coinbase = require('./coinbase.png');
const metamask = require('./metamask.png');
const tally = require('./tally.png');

export interface WalletBackgrounds {
  argent?: string;
  brave?: string;
  coinbase?: string;
  metamask?: string;
  tally?: string;
}

// Define all wallets here
export const WALLET_BACKGROUNDS: WalletBackgrounds = {
  argent,
  brave,
  coinbase,
  metamask,
  tally,
};

export type WalletBackgroundId = keyof WalletBackgrounds;
