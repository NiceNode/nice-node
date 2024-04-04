import argent from './argent.png';
import brave from './brave.png';
import coinbase from './coinbase.png';
import metamask from './metamask.png';
import tally from './tally.png';

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
