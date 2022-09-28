import { ComponentStory, ComponentMeta } from '@storybook/react';

import DockerInstallation from '../../renderer/Presentational/DockerInstallation/DockerInstallation';


export default {
  title: 'Presentational/DockerInstallation',
  component: DockerInstallation,
  argTypes: {
  },
} as ComponentMeta<typeof DockerInstallation>;

const Template: ComponentStory<typeof DockerInstallation> = (args) => <DockerInstallation {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onChange: (newValue) => console.log(newValue)
};
