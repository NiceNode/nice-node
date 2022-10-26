import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HeaderMetrics } from '../../renderer/Generics/redesign/HeaderMetrics/HeaderMetrics';

export default {
  title: 'Generic/HeaderMetrics',
  component: HeaderMetrics,
} as ComponentMeta<typeof HeaderMetrics>;

const Template: ComponentStory<typeof HeaderMetrics> = (args) => (
  <HeaderMetrics {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  name: 'ethereum',
  title: 'Ethereum node',
  info: 'Non-Validating Node — Ethereum mainnet',
  type: 'altruistic',
  status: {
    synchronized: true,
    lowPeerCount: true,
    updateAvailable: true,
    blocksBehind: false,
    noConnection: false,
    stopped: false,
    error: false,
  },
  stats: {
    block: '32,000,200',
    cpuLoad: 90,
    diskUsage: 10000,
  },
};
