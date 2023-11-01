import { Meta } from '@storybook/react';

import ContentSingleClient from '../../renderer/Presentational/ContentSingleClient/ContentSingleClient';

export default {
  title: 'Presentational/ContentSingleClient',
  component: ContentSingleClient,
} as Meta<typeof ContentSingleClient>;

export const Primary = {
  args: {
    nodeOverview: {
      nodeId: '1f916ffa-b5e8-421e-a9b2-622efc3e8223',
      name: 'geth',
      displayName: 'Geth',
      version: 'v10',
      screenType: 'client',
      nodeType: 'execution',
      status: {
        updating: false,
        synchronized: true,
        initialized: false,
        lowPeerCount: false,
        updateAvailable: false,
        blocksBehind: true,
        noConnection: false,
        stopped: false,
        error: false,
      },
      stats: {
        peers: 15,
        currentBlock: 1000,
        highestBlock: 2000,
        cpuLoad: 20,
        diskUsageGBs: 600, // in MB?
      },
    },
  },
};

export const LimitedData = {
  args: {
    nodeOverview: {
      displayName: 'Nethermind',
      nodeId: '1f916ffa-b5e8-421e-a9b2-622efc3e8223',
      name: 'nethermind',
      screenType: 'client',
      nodeType: 'L1/ExecutionClient',
      network: 'Ethereum mainnet',
      status: {
        stopped: true,
        error: false,
      },
      stats: {
        diskUsageGBs: 5.6,
      },
    },
  },
};
