import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const PrimarySmall = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
PrimarySmall.args = {
  primary: true,
  label: 'Button',
  size: 'small',
};

export const SecondarySmall = Template.bind({});
SecondarySmall.args = {
  label: 'Button',
  size: 'small',
};

export const PrimaryMedium = Template.bind({});
PrimaryMedium.args = {
  primary: true,
  size: 'medium',
  label: 'Button',
};

export const SecondaryMedium = Template.bind({});
SecondaryMedium.args = {
  size: 'medium',
  label: 'Button',
};
