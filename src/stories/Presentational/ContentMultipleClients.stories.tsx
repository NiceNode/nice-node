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
Primary.args = {
  clients: [
    {
      name: 'nimbus',
      version: 'v10',
      type: 'single',
      nodeType: 'consensus',
      status: {
        initialized: true,
        synchronized: true,
        synchronizing: 99,
        lowPeerCount: false,
        updateAvailable: false,
        blocksBehind: true,
        noConnection: false,
        stopped: false,
        error: false,
      },
      stats: {
        peers: 20,
        slot: '4,456,158',
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
        initialized: true,
        synchronizing: 99,
        synchronized: true,
        lowPeerCount: false,
        updateAvailable: true,
        blocksBehind: true,
        noConnection: false,
        stopped: false,
        error: false,
      },
      stats: {
        peers: 16,
        block: '15791798',
        cpuLoad: 82,
        diskUsage: 5000,
      },
    },
  ],
};
