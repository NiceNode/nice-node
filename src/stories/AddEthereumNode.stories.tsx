import { ComponentStory, ComponentMeta } from '@storybook/react';

import AddEthereumNode from '../renderer/Presentational/AddEthereumNode/AddEthereumNode';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/AddEthereumNode',
  component: AddEthereumNode,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof AddEthereumNode>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddEthereumNode> = (args) => <AddEthereumNode {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  onChange: (newValue) => console.log(newValue)
};
