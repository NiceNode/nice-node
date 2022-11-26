import { ComponentStory, ComponentMeta } from '@storybook/react';

import Link from '../../renderer/Generics/redesign/Link/Link';

export default {
  title: 'Generic/Link',
  component: Link,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />;

export const External = Template.bind({});
External.args = {
  text: 'This is an external link',
  url: 'http://google.com',
};

export const Internal = Template.bind({});
Internal.args = {
  text: 'Add Row',
  leftIconId: 'add',
};

export const Dropdown = Template.bind({});
Dropdown.args = {
  text: 'This is a dropdown',
  dropdown: true,
};

export const Danger = Template.bind({});
Danger.args = {
  text: 'This will delete the nodes',
  danger: true,
};

export const Small = Template.bind({});
Small.args = {
  text: 'This is so small',
  small: true,
};
