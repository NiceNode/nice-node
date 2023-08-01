import { ComponentStory, ComponentMeta } from '@storybook/react';

import PodmanInstallation from '../../renderer/Presentational/PodmanInstallation/PodmanInstallation';

export default {
  title: 'Presentational/PodmanInstallation',
  component: PodmanInstallation,
  argTypes: {},
} as ComponentMeta<typeof PodmanInstallation>;

const Template: ComponentStory<typeof PodmanInstallation> = (args) => (
  <PodmanInstallation {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  onChange: (newValue) => console.log(newValue),
};
