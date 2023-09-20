import { ComponentStory, ComponentMeta } from '@storybook/react';

import AddNodeStepper from '../../renderer/Presentational/AddNodeStepper/AddNodeStepper';

export default {
  title: 'Presentational/AddNodeStepper',
  component: AddNodeStepper,
  argTypes: {},
} as ComponentMeta<typeof AddNodeStepper>;

const Template: ComponentStory<typeof AddNodeStepper> = (args) => (
  <AddNodeStepper {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  onChange: (newValue: string) => console.log(newValue),
};
