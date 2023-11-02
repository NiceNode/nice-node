import { Meta } from '@storybook/react';

import Link from '../../renderer/Generics/redesign/Link/Linking';

export default {
  title: 'Generic/Link',
  component: Link,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Link>;

export const External = {
  args: {
    text: 'This is an external link',
    url: 'http://google.com',
  },
};

export const Internal = {
  args: {
    text: 'Add Row',
    leftIconId: 'add',
  },
};

export const Dropdown = {
  args: {
    text: 'This is a dropdown',
    dropdown: true,
  },
};

export const Danger = {
  args: {
    text: 'This will delete the nodes',
    danger: true,
  },
};

export const Small = {
  args: {
    text: 'This is so small',
    small: true,
  },
};
