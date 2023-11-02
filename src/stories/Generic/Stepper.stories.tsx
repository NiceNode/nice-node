import { Meta, StoryObj } from '@storybook/react';

import Stepper from '../../renderer/Generics/redesign/Stepper/Stepper';

export default {
  title: 'Generic/Stepper',
  component: Stepper,
} as Meta<typeof Stepper>;

export const Primary: StoryObj<typeof Stepper> = {
  args: {
    onChange: (change) => window.alert(change),
  },
};
