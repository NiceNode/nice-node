import { ComponentStory, ComponentMeta } from '@storybook/react';

import Notifications from '../../renderer/Presentational/Notifications/Notifications';
// import NotificationsWrapper from '../../renderer/Presentational/Notifications/NotificationsWrapper';

export default {
  title: 'Presentational/Notifications',
  component: Notifications,
  argTypes: {},
} as ComponentMeta<typeof Notifications>;

const Template: ComponentStory<typeof Notifications> = (args) => (
  <Notifications {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  onSettingsClick: () => {
    console.log('on settings click');
  },
  data: [
    {
      unread: true,
      status: 'info',
      title: 'Scheduled for Sync Commitee Duty',
      description: 'Validator 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      timestamp: 1673384953,
    },
    {
      unread: true,
      status: 'info',
      title: 'Reward for slashing another validator',
      description: 'Validator 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      timestamp: 1673384953,
    },
    {
      unread: true,
      status: 'completed',
      title: 'Client successfuly updated',
      description: 'Lodestar consensus client',
      timestamp: 1673384953,
    },
    {
      unread: true,
      status: 'download',
      title: 'Client update available',
      description: 'Lodestar consensus client',
      timestamp: 1673384953,
    },
    {
      unread: false,
      status: 'warning',
      title: 'More than 40 log errors in one hour',
      description: 'Lodestar consensus client',
      timestamp: 1673384953,
    },
    {
      unread: false,
      status: 'warning',
      title: 'Disk usage near 90%',
      description:
        'All nodes affected. Consider upgrading your disk to one with at least 2TB of storage.',
      timestamp: 1673384953,
    },
    {
      unread: false,
      status: 'warning',
      title: 'Internet connection down for 12 minutes',
      description: 'All nodes affected',
      timestamp: 1673384953,
    },
  ],
};
