import { Meta } from '@storybook/react';

import TabItem from '../../renderer/Generics/redesign/TabItem/TabItem';

export default {
  title: 'Generic/TabItem',
  component: TabItem,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof TabItem>;

export const TabItemActive = {
  args: {
    activeTabId: 'Sync',
    label: 'Sync',
  },
};

export const TabItemIdle = {
  args: {
    activeTabId: 'Sync',
    label: 'CPU',
  },
};
