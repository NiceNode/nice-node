import { ComponentStory, ComponentMeta } from '@storybook/react';

import AddEthereumNode from '../../renderer/Presentational/AddEthereumNode/AddEthereumNode';

export default {
  title: 'Presentational/AddEthereumNode',
  component: AddEthereumNode,
  argTypes: {
  },
} as ComponentMeta<typeof AddEthereumNode>;

const Template: ComponentStory<typeof AddEthereumNode> = (args) => <AddEthereumNode {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onChange: (newValue) => console.log(newValue)
};
