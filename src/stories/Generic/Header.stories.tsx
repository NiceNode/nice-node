import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Header } from '../../renderer/Generics/redesign/Header/Header';

export default {
  title: 'Generic/Header',
  component: Header,
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  iconId: 'ethereum',
  version: 'V0.41.0',
  title: 'Ethereum node',
  info: 'Non-Validating Node — Ethereum mainnet',
};
