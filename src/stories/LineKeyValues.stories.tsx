import { ComponentStory, ComponentMeta } from '@storybook/react';

import LabelValues from '../renderer/Generics/redesign/LabelValues/LabelValues';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/LabelValues',
  component: LabelValues,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof LabelValues>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LabelValues> = (args) => <LabelValues {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
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
