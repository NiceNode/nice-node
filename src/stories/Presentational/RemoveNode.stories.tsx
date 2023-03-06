import { ComponentStory, ComponentMeta } from '@storybook/react';

import RemoveNode from '../../renderer/Presentational/RemoveNodeModal/RemoveNode';

export default {
  title: 'Presentational/RemoveNode',
  component: RemoveNode,
  argTypes: {},
} as ComponentMeta<typeof RemoveNode>;

const Template: ComponentStory<typeof RemoveNode> = (args) => (
  <RemoveNode {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  nodeStorageUsedGBs: 100.543,
};
