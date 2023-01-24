import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tabs } from '../../renderer/Generics/redesign/Tabs/Tabs';

export default {
  title: 'Generic/Tabs',
  component: Tabs,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Tabs>;

const NodeSettingTabs: ComponentStory<typeof Tabs> = () => {
  return (
    <Tabs id="Wallet Connections">
      <div id="General">General content goes here!</div>
      <div id="Wallet Connections">Wallet connections content goes here!</div>
    </Tabs>
  );
};

export const NoteSettings = NodeSettingTabs.bind({});

const SingleClientTabs: ComponentStory<typeof Tabs> = () => {
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

export const SingleClient = SingleClientTabs.bind({});
