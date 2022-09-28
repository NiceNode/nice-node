import { ComponentStory, ComponentMeta } from '@storybook/react';

import LabelValues from '../../renderer/Generics/redesign/LabelValues/LabelValues';

export default {
  title: 'Generic/LabelValues',
  component: LabelValues,
  argTypes: {
  },
} as ComponentMeta<typeof LabelValues>;

const Template: ComponentStory<typeof LabelValues> = (args) => <LabelValues {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Node requirements',
  items: [
    {
      sectionTitle: "cpu",
      items: [
        {label: 'Cores', value: '2'},
        {label: 'Min. clock speed', value: '2.2Ghz'}
      ]
    },
    {
      sectionTitle: "storage",
      items: [
        {label: 'Type', value: 'SSD'},
        {label: 'IOPS', value: '1000IOPS'},
        {label: 'Capacity', value: '2TB'}
      ]
    },
    {
      sectionTitle: "memory",
      items: [
        {label: 'Total', value: '8GB'},
        {label: 'Free', value: '4GB'}
      ]
    }
  ]
};
