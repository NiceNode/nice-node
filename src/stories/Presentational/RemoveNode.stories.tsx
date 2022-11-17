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
  isOpen: true,
  onClickClose: () => alert('close clicked'),
  nodeDisplayName: 'Nethermind',
  nodeStorageUsedGBs: 100.543,
  onClickRemoveNode: () => alert('Start backend process to remove node. [Storybook only alert]'),
};

export const Errors = Template.bind({});
Errors.args = {
  isOpen: true,
  onClickClose: () => alert('close clicked'),
  onClickRemoveNode: () => alert('Start backend process to remove node. [Storybook only alert]'),
  errorMessage: 'There was an error removing the node. Did you move the node files?'
};
