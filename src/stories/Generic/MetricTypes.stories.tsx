import { ComponentStory, ComponentMeta } from '@storybook/react';

import { MetricTypes } from '../../renderer/Generics/redesign/MetricTypes/MetricTypes';

export default {
  title: 'Generic/MetricTypes',
  component: MetricTypes,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof MetricTypes>;

const Template: ComponentStory<typeof MetricTypes> = (args) => (
  <MetricTypes {...args} />
);

export const Status = Template.bind({});
Status.args = {
  statsValue: 'healthy',
  statsType: 'status',
};

export const Stats = Template.bind({});
Stats.args = {
  statsValue: 100,
  statsType: 'diskUsage',
};
