import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HeaderMetrics } from '../../renderer/Generics/redesign/HeaderMetrics/HeaderMetrics';

export default {
  title: 'Generic/HeaderMetrics',
  component: HeaderMetrics,
} as ComponentMeta<typeof HeaderMetrics>;

const Template: ComponentStory<typeof HeaderMetrics> = (args) => (
  <HeaderMetrics {...args} />
);

export const Primary = Template.bind({});
