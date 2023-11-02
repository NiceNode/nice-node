import { Meta } from '@storybook/react';

import { SidebarLinkItem } from '../../renderer/Generics/redesign/SidebarLinkItem/SidebarLinkItem';

export default {
  title: 'Generic/SidebarLinkItem',
  component: SidebarLinkItem,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof SidebarLinkItem>;

export const Notifications = {
  args: {
    count: 4,
    label: 'Notifications',
    iconId: 'bell',
  },
};

export const Add = {
  args: {
    label: 'Add Node',
    iconId: 'add',
  },
};

export const Preferences = {
  args: {
    label: 'Preferences',
    iconId: 'preferences',
  },
};
