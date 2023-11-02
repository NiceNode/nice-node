import { Meta } from '@storybook/react';

import { ClientCard } from '../../renderer/Generics/redesign/ClientCard/ClientCard';

export default {
  title: 'Generic/ClientCard',
  component: ClientCard,
} as Meta<typeof ClientCard>;

export const Nethermind = {
  args: {
    name: 'erigon',
    version: 'v10',
    nodeType: 'execution',
    status: {
      updating: false,
      initialized: true,
      lowPeerCount: false,
      synchronized: true,
      updateAvailable: true,
      blocksBehind: false,
      noConnection: false,
      stopped: false,
      error: false,
    },
    stats: {
      peers: 16,
      currentSlot: 90,
      highestSlot: 190,
      cpuLoad: 82,
      diskUsageGBs: 5000,
    },
  },
};
