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

export const Primary = Template.bind({});
Primary.args = {
  title: 'Syncing',
  label: 'In Progress..',
  status: 'sync',
};
