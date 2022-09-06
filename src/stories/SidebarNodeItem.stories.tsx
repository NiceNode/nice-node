import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SidebarNodeItem } from '../renderer/Generics/redesign/SidebarNodeItem';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/SidebarNodeItem',
  component: SidebarNodeItem,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SidebarNodeItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SidebarNodeItem> = (args) => (
  <SidebarNodeItem {...args} />
);

export const Ethereum = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Ethereum.args = {
  iconId: 'ethereum',
  status: 'healthy',
  title: 'Ethereum node',
  info: 'Mainnet',
};
