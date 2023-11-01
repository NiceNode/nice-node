import { Meta } from '@storybook/react';

import Splash from '../../renderer/Generics/redesign/Splash/Splash';

export default {
  title: 'Generic/SplashScreen',
  component: Splash,
} as Meta<typeof Splash>;

export const Primary = {
  args: {
    title: 'Welcome to NiceNode',
    description:
      'Run a node how you want it — without commands and a terminal. NiceNode shows what the node is doing at a glance. Stats like how many peer nodes are connected and synching progress are built into the app.',
  },
};
