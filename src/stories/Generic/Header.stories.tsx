import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Header } from '../../renderer/Generics/redesign/Header/Header';

export default {
  title: 'Generic/Header',
  component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  name: 'ethereum',
  title: 'Ethereum node',
  info: 'Non-Validating Node — Ethereum mainnet',
  type: 'altruistic',
  status: {
    updating: false,
    initialized: true,
    synchronizing: 100,
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
    diskUsage: 10000,
  },
};
