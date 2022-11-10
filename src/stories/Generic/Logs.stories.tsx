import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Logs } from '../../renderer/Generics/redesign/LogMessage/Logs';

export default {
  title: 'Generic/Logs',
  component: Logs,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Logs>;

const Template: ComponentStory<typeof Logs> = (args) => <Logs {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
