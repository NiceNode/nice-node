import type { Meta } from '@storybook/react';

import { NotificationIcon } from '../../renderer/Generics/redesign/NotificationIcon/NotificationIcon';

export default {
  title: 'Generic/NotificationIcon',
  component: NotificationIcon,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof NotificationIcon>;

export const Unread = {
  args: {
    status: 'info',
    unread: true,
  },
};
