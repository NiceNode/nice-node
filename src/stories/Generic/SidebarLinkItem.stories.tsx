import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SidebarLinkItem } from '../../renderer/Generics/redesign/SidebarLinkItem';

export default {
  title: 'Generic/SidebarLinkItem',
  component: SidebarLinkItem,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SidebarLinkItem>;

const Template: ComponentStory<typeof SidebarLinkItem> = (args) => (
  <SidebarLinkItem {...args} />
);

export const Notifications = Template.bind({});
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
