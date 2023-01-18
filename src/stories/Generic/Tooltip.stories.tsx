import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Tooltip } from '../../renderer/Generics/redesign/Tooltip/Tooltip';

export default {
  title: 'Generic/Tooltip',
  component: Tooltip,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  title: 'Low peer count',
  content: 'Try lorem ipsum sit dolor amet.',
};
