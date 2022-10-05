import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../../renderer/Generics/redesign/Button/Button';
import { ReactComponent as SettingsIcon } from '../../renderer/assets/images/icons/Settings.svg';
// import SettingsIcon from '../../renderer/assets/images/icons/Settings.svg';

export default {
  title: 'Generic/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const PrimarySmall = Template.bind({});
PrimarySmall.args = {
  primary: true,
  label: 'Button',
  size: 'small',
};
export const PrimarySmallIcon = Template.bind({});
PrimarySmallIcon.args = {
  primary: true,
  label: 'Button',
  size: 'small',
  iconId: 'settings',
};

export const SecondarySmall = Template.bind({});
SecondarySmall.args = {
  label: 'Button',
  size: 'small',
};

export const PrimaryMedium = Template.bind({});
PrimaryMedium.args = {
  primary: true,
  size: 'medium',
  label: 'Button',
};

export const SecondaryMedium = Template.bind({});
SecondaryMedium.args = {
  size: 'medium',
  label: 'Button',
};

export const SecondaryMediumIcon = Template.bind({});
SecondaryMediumIcon.args = {
  size: 'medium',
  label: 'Settings',
  iconId: 'settings',
  variant: 'icon-right',
};
