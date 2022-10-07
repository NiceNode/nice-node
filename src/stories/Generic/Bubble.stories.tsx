import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Bubble } from '../../renderer/Generics/redesign/Bubble/Bubble';

export default {
  title: 'Generic/Bubble',
  component: Bubble,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Bubble>;

const Template: ComponentStory<typeof Bubble> = (args) => <Bubble {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  count: 23,
};
