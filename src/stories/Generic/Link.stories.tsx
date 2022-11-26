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
