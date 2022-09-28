import { ComponentStory, ComponentMeta } from '@storybook/react';

import DockerInstallation from '../../renderer/Presentational/DockerInstallation/DockerInstallation';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Presentational/DockerInstallation',
  component: DockerInstallation,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof DockerInstallation>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DockerInstallation> = (args) => <DockerInstallation {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  onChange: (newValue) => console.log(newValue)
};
