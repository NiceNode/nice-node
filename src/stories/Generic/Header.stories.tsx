import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Header } from '../../renderer/Generics/redesign/Header/Header';

export default {
  title: 'Generic/Header',
  component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  //TODO: fix this so we only pass in params?
  nodeOverview: {
    name: 'ethereum',
    title: 'Ethereum node',
    info: 'Non-Validating Node — Ethereum mainnet',
    type: 'altruistic',
    status: 'healthy', // change this to enum to compare weights?
    stats: {
      block: '32,000,200',
      cpuLoad: 90,
      diskUsage: 10000,
    },
  },
};
