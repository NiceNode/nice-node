import { Meta } from '@storybook/react';

import { Toggle } from '../../renderer/Generics/redesign/Toggle/Toggle';

export default {
  title: 'Generic/Toggle',
  component: Toggle,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Toggle>;

export const Primary = {
  args: {},
};
