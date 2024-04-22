import type { Meta } from '@storybook/react';
import { SYNC_STATUS } from '../../renderer/Generics/redesign/consts';

import { MetricTypes } from '../../renderer/Generics/redesign/MetricTypes/MetricTypes';

export default {
  title: 'Generic/MetricTypes',
  component: MetricTypes,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof MetricTypes>;

export const Status = {
  args: {
    statsValue: SYNC_STATUS.SYNCHRONIZED,
    statsType: 'status',
  },
};

export const Stats = {
  args: {
    statsValue: 100,
    statsType: 'diskUsageGBs',
  },
};
