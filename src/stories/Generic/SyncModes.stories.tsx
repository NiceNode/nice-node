import { Meta } from '@storybook/react';

import SyncModes from '../../renderer/Generics/redesign/SyncModes/SyncModes';

export default {
  title: 'Generic/SyncModes',
  component: SyncModes,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof SyncModes>;

export const Primary = {
  args: {
    controlTranslations: [
      {
        value: 'snap',
        config: '--syncmode snap',
      },
      {
        value: 'full',
        config: '--syncmode full',
      },
      {
        value: 'archive',
        config: '--syncmode full --gcmode archive',
      },
    ],
    type: 'pink',
  },
};
