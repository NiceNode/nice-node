import { ComponentStory, ComponentMeta } from '@storybook/react';

import Sidebar from '../../renderer/Presentational/Sidebar/Sidebar';

export default {
  title: 'Presentational/Sidebar',
  component: Sidebar,
  argTypes: {},
} as ComponentMeta<typeof Sidebar>;

const Template: ComponentStory<typeof Sidebar> = (args) => (
  <Sidebar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
