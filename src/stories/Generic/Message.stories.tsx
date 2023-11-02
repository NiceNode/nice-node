import { Meta } from '@storybook/react';

import { Message } from '../../renderer/Generics/redesign/Message/Message';

export default {
  title: 'Generic/Message',
  component: Message,
} as Meta<typeof Message>;

export const Info = {
  args: {
    type: 'info',
    title: 'Initial sync process started',
    description:
      'When adding a node it first needs to catch up on the history of the network. This process downloads all the necessary data and might take a couple of days. After synchronization is complete your node will be online and part of the network.',
  },
};
