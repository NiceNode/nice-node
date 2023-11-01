import { Meta } from '@storybook/react';

import { Banner } from '../../renderer/Generics/redesign/Banner/Banner';

export default {
  title: 'Generic/Banner',
  component: Banner,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Banner>;

export const Primary = {
  args: {
    updateAvailable: true,
  },
};
