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
    diskUsage: 5000,
  },
};
