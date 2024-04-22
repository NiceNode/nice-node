import type { Meta } from '@storybook/react';

import AddNodeStepper from '../../renderer/Presentational/AddNodeStepper/AddNodeStepper';

export default {
  title: 'Presentational/AddNodeStepper',
  component: AddNodeStepper,
} as Meta<typeof AddNodeStepper>;

export const Primary = {
  args: {
    onChange: (newValue: string) => console.log(newValue),
  },
};
