import { ComponentStory, ComponentMeta } from '@storybook/react';

import AddNodeConfiguration from '../../renderer/Presentational/AddNodeConfiguration/AddNodeConfiguration';

export default {
  title: 'Presentational/AddNodeConfiguration',
  component: AddNodeConfiguration,
  argTypes: {},
} as ComponentMeta<typeof AddNodeConfiguration>;

const Template: ComponentStory<typeof AddNodeConfiguration> = (args) => (
  <AddNodeConfiguration {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  onChange: (newValue) => console.log(newValue),
};
