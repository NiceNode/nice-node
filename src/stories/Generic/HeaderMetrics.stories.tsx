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
  nodeOverview: {
    name: 'ethereum',
    title: 'Ethereum node',
    info: 'Non-Validating Node — Ethereum mainnet',
    type: 'altruistic',
    status: {
      syncStatus: 'healthy', // change this to enum to compare weights?
      updateAvailable: true, // look through both clients
    },
    stats: {
      block: '32,000,200',
      cpuLoad: 90,
      diskUsage: 10000,
    },
  },
};
