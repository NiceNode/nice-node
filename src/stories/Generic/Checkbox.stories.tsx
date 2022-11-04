import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Checkbox } from '../../renderer/Generics/redesign/Checkbox/Checkbox';

export default {
  title: 'Generic/Checkbox',
  component: Checkbox,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
