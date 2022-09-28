import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Toggle } from '../../renderer/Generics/redesign/Toggle';

export default {
  title: 'Generic/Toggle',
  component: Toggle,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => <Toggle {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
