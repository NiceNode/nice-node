import { ComponentStory, ComponentMeta } from '@storybook/react';

import ExternalLink from '../renderer/Generics/ExternalLink';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/ExternalLink',
  component: ExternalLink,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ExternalLink>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExternalLink> = (args) => <ExternalLink {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: 'Docker Install Guide',
  url: 'https://docs.docker.com/desktop/#download-and-install',
};


