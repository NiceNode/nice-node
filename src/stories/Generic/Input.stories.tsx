import type { Meta, StoryFn } from '@storybook/react';
import FolderInput from '../../renderer/Generics/redesign/Input/FolderInput';

import Input from '../../renderer/Generics/redesign/Input/Input';

export default {
  title: 'Generic/Input',
  component: Input,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = (args) => (
  <div style={{ width: 300 }}>
    <Input {...args} />
  </div>
);

export const Primary = {
  render: Template,

  args: {
    placeholder: 'Test placeholder',
  },
};

export const Icon = {
  render: Template,

  args: {
    leftIconId: 'search',
    placeholder: 'Test placeholder',
  },
};

const FolderTemplate: StoryFn<typeof FolderInput> = (args) => (
  <FolderInput {...args} />
);

export const FolderInputPrimary = {
  render: FolderTemplate,

  args: {
    placeholder: '/Users/Danneh/Library/Application Library/NiceNode/nodes',
    onClickChange: () => {
      alert('Platform specific user prompt to select a folder location');
    },
    freeStorageSpaceGBs: 250,
  },
};
