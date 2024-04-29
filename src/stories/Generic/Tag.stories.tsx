import type { Meta } from '@storybook/react';

import Tag from '../../renderer/Generics/redesign/Tag/Tag';

export default {
  title: 'Generic/Tag',
  component: Tag,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Tag>;

export const Primary = {
  args: {
    label: 'Minority Client',
    type: 'pink',
  },
};
