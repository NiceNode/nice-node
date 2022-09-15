import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Checklist } from '../renderer/Generics/redesign/Checklist/Checklist';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Checklist',
  component: Checklist,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof Checklist>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Checklist> = (args) => <Checklist {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: 'Node requirements',
  items: [
    {
      status:"loading",
      checkTitle:"Processor supported by clients"
    },
    {
      status:"complete",
      checkTitle:"At least 4GB of system memory (RAM)",
      valueText:"System memory: 32GB"},
    {
      status:"incomplete",
      checkTitle:"Storage disk type is SSD",
      valueText:"Disk type: Hard Disk Drive (HDD).",
      captionText:"While SSD is recommended you are still able to run a node with a HDD if you have 8GB or more of system memory (RAM) available."
    },
    {
      status:"error",
      checkTitle:"Available disk space for fast sync is 500GB or more",
      valueText:"Selected disk: Macintosh HD with only 126GB free disk space.",
      captionText:" Additional storage capacity is require to run this node type! Consider adding an external SSD."
    }
  ]
};
