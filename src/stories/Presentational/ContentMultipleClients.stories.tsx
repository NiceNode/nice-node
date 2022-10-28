import { ComponentStory, ComponentMeta } from '@storybook/react';

import ContentMultipleClients from '../../renderer/Presentational/ContentMultipleClients/ContentMultipleClients';

export default {
  title: 'Presentational/ContentMultipleClients',
  component: ContentMultipleClients,
  argTypes: {},
} as ComponentMeta<typeof ContentMultipleClients>;

const Template: ComponentStory<typeof ContentMultipleClients> = (args) => (
  <ContentMultipleClients {...args} />
);

export const Primary = Template.bind({});
const currentSlot = 190;
const highestSlot = 190;
const currentBlock = 2990;
const highestBlock = 3000;
Primary.args = {
  clients: [
    {
      name: 'nimbus',
      version: 'v10',
      type: 'single',
      nodeType: 'consensus',
      status: {
        updating: false,
        initialized: true,
        synchronized: highestSlot - currentSlot <= 3,
        blocksBehind:
          highestSlot - currentSlot > 3 && highestSlot - currentSlot <= 10,
        lowPeerCount: false,
        updateAvailable: false,
        noConnection: false,
        stopped: false,
        error: false,
      },
      stats: {
        currentSlot: currentSlot,
        highestSlot: highestSlot,
        peers: 20,
        cpuLoad: 20,
        diskUsage: 600, // in MB?
      },
    },
    {
      name: 'besu',
      version: 'v10',
      type: 'single',
      nodeType: 'execution',
      status: {
        updating: false,
        initialized: true,
        synchronized: highestBlock - currentBlock <= 3,
        blocksBehind:
          highestBlock - currentBlock > 3 && highestBlock - currentBlock <= 10,
        lowPeerCount: false,
        updateAvailable: true,
        noConnection: false,
        stopped: false,
        error: false,
      },
      stats: {
        currentBlock: currentBlock,
        highestBlock: highestBlock,
        peers: 16,
        cpuLoad: 82,
        diskUsage: 5000,
      },
    },
  ],
};
