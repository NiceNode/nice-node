import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Menu } from '../../renderer/Generics/redesign/Menu/Menu';

export default {
  title: 'Generic/Menu',
  component: Menu,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Menu>;

const Template: ComponentStory<typeof Menu> = (args) => <Menu {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  width: 156,
};
