import { ComponentStory, ComponentMeta } from '@storybook/react';

import Preferences from '../../renderer/Presentational/Preferences/Preferences';

export default {
  title: 'Presentational/Preferences',
  component: Preferences,
  argTypes: {},
} as ComponentMeta<typeof Preferences>;

const Template: ComponentStory<typeof Preferences> = (args) => (
  <Preferences {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  onClose: () => alert('close'),
  themeSetting: 'dark',
  isOpenOnStartup: true,
  version: 'v69.69',
};
