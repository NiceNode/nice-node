import { ComponentStory, ComponentMeta } from '@storybook/react';

import Tag from '../../renderer/Generics/redesign/Tag/Tag';

export default {
  title: 'Generic/Tag',
  component: Tag,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Tag>;

const Template: ComponentStory<typeof Tag> = (args) => <Tag {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Minority Client',
  type: 'pink',
};
