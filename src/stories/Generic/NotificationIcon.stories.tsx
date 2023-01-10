import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NotificationIcon } from '../../renderer/Generics/redesign/NotificationIcon/NotificationIcon';

export default {
  title: 'Generic/NotificationIcon',
  component: NotificationIcon,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof NotificationIcon>;

const Template: ComponentStory<typeof NotificationIcon> = (args) => (
  <NotificationIcon {...args} />
);

export const Unread = Template.bind({});
Unread.args = {
  status: 'info',
  unread: true,
};
