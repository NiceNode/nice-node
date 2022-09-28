import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Stepper from '../renderer/Generics/redesign/Stepper/Stepper';
import {Bubble} from '../renderer/Generics/redesign/Bubble'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Stepper',
  component: Stepper,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof Stepper>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Stepper> = (args) => <Stepper {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  onChange: (change) => window.alert(change),
  children: <Bubble count={110}/>
}
