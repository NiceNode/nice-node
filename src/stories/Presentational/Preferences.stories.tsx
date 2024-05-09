import type { Meta } from '@storybook/react';

import Preferences from '../../renderer/Presentational/Preferences/Preferences';

export default {
  title: 'Presentational/Preferences',
  component: Preferences,
} as Meta<typeof Preferences>;

export const Primary = {
  args: {
    themeSetting: 'dark',
    isOpenOnStartup: true,
    version: 'v69.69',
  },
};
