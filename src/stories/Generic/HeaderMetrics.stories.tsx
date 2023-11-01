import { Meta } from '@storybook/react';

import { HeaderMetrics } from '../../renderer/Generics/redesign/HeaderMetrics/HeaderMetrics';

export default {
  title: 'Generic/HeaderMetrics',
  component: HeaderMetrics,
} as Meta<typeof HeaderMetrics>;

export const Primary = {
  args: {
    name: 'besu',
    title: 'Ethereum node',
    info: 'Non-Validating Node — Ethereum mainnet',
    screenType: 'nodePackage',
    status: {
      updating: false,
      initialized: true,
      synchronized: true,
      lowPeerCount: true,
      updateAvailable: true,
      blocksBehind: false,
      noConnection: false,
      stopped: false,
      error: false,
    },
    stats: {
      currentSlot: 90,
      highestSlot: 190,
      cpuLoad: 90,
      diskUsageGBs: 10000,
    },
  },
};
