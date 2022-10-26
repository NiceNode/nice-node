import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ClientCard } from '../../renderer/Generics/redesign/ClientCard/ClientCard';

export default {
  title: 'Generic/ClientCard',
  component: ClientCard,
} as ComponentMeta<typeof ClientCard>;

const Template: ComponentStory<typeof ClientCard> = (args) => (
  <ClientCard {...args} />
);

export const Nethermind = Template.bind({});
Nethermind.args = {
  name: 'erigon',
  version: 'v10',
  type: 'single',
  nodeType: 'execution',
  status: {
    synchronized: true,
    lowPeerCount: false,
    updateAvailable: true,
    blocksBehind: false,
    noConnection: false,
    stopped: false,
    error: false,
  },
  stats: {
    peers: 16,
    slot: '15791798',
    cpuLoad: 82,
    diskUsage: 5000,
  },
};
