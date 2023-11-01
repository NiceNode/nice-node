import { Meta } from '@storybook/react';

import InternalLink from '../../renderer/Generics/redesign/Link/InternalLink';

export default {
  title: 'Generic/InternalLink',
  component: InternalLink,
} as Meta<typeof InternalLink>;

export const Primary = {
  args: {
    text: 'Docker Install Guide',
    onClick: () => alert('Click!'),
  },
};

export const Danger = {
  args: {
    text: 'Delete this thing',
    onClick: () => alert('Click!'),
    danger: true,
  },
};
