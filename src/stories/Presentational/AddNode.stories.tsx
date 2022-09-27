import { ComponentStory, ComponentMeta } from '@storybook/react';

import AddNode from '../../renderer/Presentational/AddNode/AddNode';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Presentational/AddNode',
  component: AddNode,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof AddNode>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddNode> = (args) => <AddNode {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  onChange: (newValue) => console.log(newValue)
};
