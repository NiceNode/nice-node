import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Label } from '../../renderer/Generics/redesign/Label/Label';

export default {
  title: 'Generic/Label',
  component: Label,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Label>;

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Minority Client',
  type: 'pink',
};
