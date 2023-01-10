import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NotificationItem } from '../../renderer/Generics/redesign/NotificationItem/NotificationItem';

export default {
  title: 'Generic/NotificationItem',
  component: NotificationItem,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof NotificationItem>;

const Template: ComponentStory<typeof NotificationItem> = (args) => (
  <NotificationItem {...args} />
);

export const Completed = Template.bind({});
Completed.args = {
  unread: true,
  status: 'completed',
  title: 'Client successfuly updated',
  description: 'Lodestar consensus client',
  timestamp: 1673384953,
};
