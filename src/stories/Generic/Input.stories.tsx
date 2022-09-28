import { ComponentStory, ComponentMeta } from '@storybook/react';

import Input from '../../renderer/Generics/redesign/Input/Input';


export default {
  title: 'Generic/Input',
  component: Input,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => (
  <div style={{ width: 300 }}>
    <Input {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'Test placeholder',
};
