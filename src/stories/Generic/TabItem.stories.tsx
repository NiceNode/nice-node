import { ComponentStory, ComponentMeta } from '@storybook/react';

import TabItem from '../../renderer/Generics/redesign/TabItem/TabItem';

export default {
  title: 'Generic/TabItem',
  component: TabItem,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof TabItem>;

const Template: ComponentStory<typeof TabItem> = (args) => (
  <TabItem {...args} />
);

export const TabItemActive = Template.bind({});

TabItemActive.args = {
  active: true,
  label: 'Active Tab',
};

export const TabItemIdle = Template.bind({});

TabItemIdle.args = {
  active: false,
  label: 'Idle Tab',
};
