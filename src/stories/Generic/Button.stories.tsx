import { Meta } from '@storybook/react';

import Button from '../../renderer/Generics/redesign/Button/Button';

export default {
  title: 'Generic/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Button>;

export const PrimarySmall = {
  args: {
    type: 'primary',
    label: 'Button',
    size: 'small',
  },
};

export const PrimarySmallIcon = {
  args: {
    type: 'primary',
    label: 'Button',
    size: 'small',
    iconId: 'settings',
  },
};

export const SecondarySmall = {
  args: {
    label: 'Button',
    size: 'small',
  },
};

export const PrimaryMedium = {
  args: {
    type: 'primary',
    size: 'medium',
    label: 'Button',
  },
};

export const SecondaryMedium = {
  args: {
    size: 'medium',
    label: 'Button',
  },
};

export const SecondaryMediumIcon = {
  args: {
    size: 'small',
    iconId: 'close',
    variant: 'icon',
    type: 'ghost',
  },
};

export const GhostSmallIcon = {};
