import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SidebarNodeItem } from '../../renderer/Generics/redesign/SidebarNodeItem/SidebarNodeItem';

export default {
  title: 'Generic/SidebarNodeItem',
  component: SidebarNodeItem,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SidebarNodeItem>;

const Template: ComponentStory<typeof SidebarNodeItem> = (args) => (
  <SidebarNodeItem {...args} />
);

export const Ethereum = Template.bind({});
Ethereum.args = {
  iconId: 'ethereum',
  status: 'healthy',
  title: 'Ethereum node',
  info: 'Mainnet',
};
