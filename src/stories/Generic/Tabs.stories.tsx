import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tabs } from '../../renderer/Generics/redesign/Tabs/Tabs';

export default {
  title: 'Generic/Tabs',
  component: Tabs,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Tabs>;

const NodeSettingTabs: ComponentStory<typeof Tabs> = (args) => {
  return (
    <Tabs>
      <div label="General">General content goes here!</div>
      <div label="Wallet Connections">
        Wallet connections content goes here!
      </div>
    </Tabs>
  );
};

export const NoteSettings = NodeSettingTabs.bind({});

const SingleClientTabs: ComponentStory<typeof Tabs> = (args) => {
  return (
    <Tabs>
      <div label="Sync">Sync content goes here!</div>
      <div label="CPU">CPU content goes here!</div>
      <div label="Memory">Memory content goes here!</div>
      <div label="Network">Network content goes here!</div>
      <div label="Disk">Disk content goes here!</div>
    </Tabs>
  );
};

export const SingleClient = SingleClientTabs.bind({});
