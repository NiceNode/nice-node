import type { Meta } from '@storybook/react';

import { Tooltip } from '../../renderer/Generics/redesign/Tooltip/Tooltip';

export default {
  title: 'Generic/Tooltip',
  component: Tooltip,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Tooltip>;

export const Primary = {
  args: {
    title: 'Low peer count',
    content: 'Try lorem ipsum sit dolor amet.',
  },
};
