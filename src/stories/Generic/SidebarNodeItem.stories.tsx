import { Meta } from '@storybook/react';

import { SidebarNodeItem } from '../../renderer/Generics/redesign/SidebarNodeItem/SidebarNodeItem';

export default {
  title: 'Generic/SidebarNodeItem',
  component: SidebarNodeItem,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof SidebarNodeItem>;

export const Ethereum = {
  args: {
    iconId: 'ethereum',
    status: 'healthy',
    title: 'Ethereum node',
    info: 'Mainnet',
  },
};
