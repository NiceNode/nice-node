import { StoryFn, Meta } from '@storybook/react';
import { Tabs } from '../../renderer/Generics/redesign/Tabs/Tabs';

export default {
  title: 'Generic/Tabs',
  component: Tabs,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Tabs>;

const NodeSettingTabs: StoryFn<typeof Tabs> = () => {
  return (
    <Tabs id="Wallet Connections">
      <div id="General">General content goes here!</div>
      <div id="Wallet Connections">Wallet connections content goes here!</div>
    </Tabs>
  );
};

export const NoteSettings = {
  render: NodeSettingTabs,
};

const SingleClientTabs: StoryFn<typeof Tabs> = () => {
  return (
    <Tabs>
      <div id="Sync">Sync content goes here!</div>
      <div id="CPU">CPU content goes here!</div>
      <div id="Memory">Memory content goes here!</div>
      <div id="Network">Network content goes here!</div>
      <div id="Disk">Disk content goes here!</div>
    </Tabs>
  );
};

export const SingleClient = {
  render: SingleClientTabs,
};
