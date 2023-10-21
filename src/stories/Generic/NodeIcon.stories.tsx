import { ComponentStory, ComponentMeta } from '@storybook/react';

import NodeIcon from '../../renderer/Generics/redesign/NodeIcon/NodeIcon';

export default {
  title: 'Generic/NodeIcon',
  component: NodeIcon,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof NodeIcon>;

const Template: ComponentStory<typeof NodeIcon> = (args) => (
  <NodeIcon {...args} />
);

export const Default = Template.bind({});
Default.args = {
  iconId: 'ethereum',
  size: 'small',
};

export const Small = Template.bind({});
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
