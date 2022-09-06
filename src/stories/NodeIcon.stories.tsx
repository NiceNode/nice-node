import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NodeIcon } from '../renderer/Generics/redesign/NodeIcon';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/NodeIcon',
  component: NodeIcon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof NodeIcon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NodeIcon> = (args) => (
  <NodeIcon {...args} />
);

export const Default = Template.bind({});
Default.args = {
  iconId: 'ethereum',
  size: 'small',
};

export const Small = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Small.args = {
  iconId: 'ethereum',
  status: 'healthy',
  size: 'small',
};

export const Medium = Template.bind({});
Medium.args = {
  iconId: 'ethereum',
  status: 'warning',
  size: 'medium',
};

export const Large = Template.bind({});
Large.args = {
  iconId: 'ethereum',
  status: 'error',
  size: 'large',
};
