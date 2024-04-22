import type { Meta } from '@storybook/react';

import { ContentHeader } from '../../renderer/Generics/redesign/ContentHeader/ContentHeader';

export default {
  title: 'Generic/ContentHeader',
  component: ContentHeader,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof ContentHeader>;

export const Primary = {
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    leftButtonIconId: 'left',
    rightButtonIconId: 'close',
  },
};
