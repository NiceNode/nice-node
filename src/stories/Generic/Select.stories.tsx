import { ComponentStory, ComponentMeta } from '@storybook/react';

import Select from '../../renderer/Generics/redesign/Select/Select';

export default {
  title: 'Generic/Select',
  component: Select,
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => <Select {...args} />;

export const Single = Template.bind({});
Single.args = {
  value: 'dark',
  options: [
    {
      value: 'auto',
      label: 'Auto (Follows computer settings)',
    },
    { value: 'light', label: 'Light mode' },
    { value: 'dark', label: 'Dark mode' }
  ]
};
