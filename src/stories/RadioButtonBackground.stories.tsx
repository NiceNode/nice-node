import { ComponentStory, ComponentMeta } from '@storybook/react';

import { RadioButtonBackground } from '../renderer/Generics/redesign/RadioButtonBackground';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/RadioButtonBackground',
  component: RadioButtonBackground,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof RadioButtonBackground>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RadioButtonBackground> = (args) => (
  <RadioButtonBackground {...args} />
);

export const Ethereum = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Ethereum.args = {
  children: <div> Test </div>,
};
