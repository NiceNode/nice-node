import { ComponentStory, ComponentMeta } from '@storybook/react';

import InternalLink from '../../renderer/Generics/redesign/Link/InternalLink';


export default {
  title: 'Generic/InternalLink',
  component: InternalLink,
} as ComponentMeta<typeof InternalLink>;

const Template: ComponentStory<typeof InternalLink> = (args) => <InternalLink {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: 'Docker Install Guide',
  onClick: () => alert("Click!")
};

export const Danger = Template.bind({});
Danger.args = {
  text: 'Delete this thing',
  onClick: () => alert("Click!"),
  danger: true
};


