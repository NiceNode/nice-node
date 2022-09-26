import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Select, Option } from '../renderer/Generics/redesign/Select';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Generic/Select',
  component: Select,
} as ComponentMeta<typeof Select>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

export const Single = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Single.args = {
  children: (
    <>
      <Option>Apple</Option>
      <Option>Orange</Option>
      <Option>Pear</Option>
    </>
  ),
};

export const Multi = Template.bind({});
Multi.args = {
  children: (
    <>
      <Option>Apple</Option>
      <Option>Orange</Option>
      <Option>Pear</Option>
    </>
  ),
};
