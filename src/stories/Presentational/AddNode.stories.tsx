import { ComponentStory, ComponentMeta } from '@storybook/react';

import AddNode from '../../renderer/Presentational/AddNode/AddNode';


export default {
  title: 'Presentational/AddNode',
  component: AddNode,
  argTypes: {
  },
} as ComponentMeta<typeof AddNode>;

const Template: ComponentStory<typeof AddNode> = (args) => <AddNode {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onChange: (newValue) => console.log(newValue)
};
