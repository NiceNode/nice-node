import { ComponentStory, ComponentMeta } from '@storybook/react';

import Stepper from '../../renderer/Generics/redesign/Stepper/Stepper';

export default {
  title: 'Generic/Stepper',
  component: Stepper,
  argTypes: {},
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => (
  <Stepper {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  onChange: (change) => window.alert(change),
};
