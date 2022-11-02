import { ComponentStory, ComponentMeta } from '@storybook/react';
import FolderInput from '../../renderer/Generics/redesign/Input/FolderInput';

import Input from '../../renderer/Generics/redesign/Input/Input';


export default {
  title: 'Generic/Input',
  component: Input,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => (
  <div style={{ width: 300 }}>
    <Input {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'Test placeholder',
};

const FolderTemplate: ComponentStory<typeof FolderInput> = (args) => (
    <FolderInput {...args} />
);

export let FolderInputPrimary = FolderTemplate.bind({});
FolderInputPrimary.args = {
  placeholder: '/Users/Danneh/Library/Application Library/NiceNode/nodes',
  onClickChange: () => {
    alert('Platform specific user prompt to select a folder location')
  },
  freeStorageSpaceGBs: 250
};
