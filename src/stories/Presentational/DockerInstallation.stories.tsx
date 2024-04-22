import type { Meta, StoryObj } from '@storybook/react';

import PodmanInstallation from '../../renderer/Presentational/PodmanInstallation/PodmanInstallation';

export default {
  title: 'Presentational/PodmanInstallation',
  component: PodmanInstallation,
} as Meta<typeof PodmanInstallation>;

export const Primary: StoryObj<typeof PodmanInstallation> = {
  args: {
    onChange: (newValue) => console.log(newValue),
  },
};
