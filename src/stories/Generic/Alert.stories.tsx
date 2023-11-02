import { Meta } from '@storybook/react';

import { Alert } from '../../renderer/Generics/redesign/Alert/Alert';

export default {
  title: 'Generic/Alert',
  component: Alert,
} as Meta<typeof Alert>;

export const Primary = {
  args: {
    title: 'Something happened',
    isOpen: true,
    message:
      'You need to be aware this happened. Let NiceNode fix this automatically?',
    onClickCloseButton: () => alert('Closing does not work in Storybook'),
    onClickActionButton: () => alert('The user confirmed the alert.'),
  },
};

export const RemoveNode = {
  args: {
    title: 'Remove node',
    isOpen: true,
    message:
      'Are you sure you want to delete “Ethereum node”? Chain related data and configuration settings will be removed.',
    onClickCloseButton: () => alert('Closing does not work in Storybook'),
    onClickActionButton: () => alert('The user confirmed the remove.'),
    acceptText: 'Remove',
    acceptType: 'danger',
  },
};
