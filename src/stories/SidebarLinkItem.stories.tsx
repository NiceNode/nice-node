import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SidebarLinkItem } from '../renderer/Generics/redesign/SidebarLinkItem';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Generic/SidebarLinkItem',
  component: SidebarLinkItem,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SidebarLinkItem>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SidebarLinkItem> = (args) => (
  <SidebarLinkItem {...args} />
);

export const Notifications = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Notifications.args = {
  count: 4,
  label: 'Notifications',
  iconId: 'bell',
};

export const Add = Template.bind({});
Add.args = {
  label: 'Add Node',
  iconId: 'add',
};

export const Preferences = Template.bind({});
Preferences.args = {
  label: 'Preferences',
  iconId: 'preferences',
};
