import type { Meta } from '@storybook/react';

import { Label } from '../../renderer/Generics/redesign/Label/Label';

export default {
  title: 'Generic/Label',
  component: Label,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Label>;

export const Primary = {
  args: {
    label: 'Minority Client',
    type: 'pink',
  },
};
