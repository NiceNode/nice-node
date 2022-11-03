import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MenuItem } from '../../renderer/Generics/redesign/MenuItem/MenuItem';
import { HorizontalLine } from '../../renderer/Generics/redesign/HorizontalLine/HorizontalLine';
import { Menu } from '../../renderer/Generics/redesign/Menu/Menu';

export default {
  title: 'Generic/Menu',
  component: Menu,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Menu>;

export const Settings: ComponentStory<typeof Menu> = () => (
  <Menu width={156}>
    <MenuItem
      text="Restart Client"
      onClick={() => {
        console.log('Restart Client');
      }}
    />
    <MenuItem
      text="Check for Updates..."
      onClick={() => {
        console.log('Check for Updates...');
      }}
    />
    <HorizontalLine type="menu" />
    <MenuItem
      text="Client Versions"
      onClick={() => {
        console.log('Client Versions');
      }}
    />
    <HorizontalLine type="menu" />
    <MenuItem
      text="Switch Client"
      onClick={() => {
        console.log('Switch Client');
      }}
      disabled
    />
  </Menu>
);

export const LogMessageType: ComponentStory<typeof Menu> = () => (
  <Menu width={156}>
    <MenuItem
      variant="checkbox"
      status="blue"
      text="Info"
      onClick={() => {
        console.log('Info');
      }}
    />
    <MenuItem
      variant="checkbox"
      status="yellow"
      text="Warnings"
      onClick={() => {
        console.log('Warnings');
      }}
    />
    <MenuItem
      variant="checkbox"
      status="red"
      text="Errors"
      onClick={() => {
        console.log('Errors');
      }}
    />
  </Menu>
);

export const LogMessageTime: ComponentStory<typeof Menu> = () => (
  <Menu width={156}>
    <MenuItem
      text="Restart Client"
      onClick={() => {
        console.log('Restart Client');
      }}
    />
    <MenuItem
      text="Check for Updates..."
      onClick={() => {
        console.log('Check for Updates...');
      }}
    />
    <HorizontalLine type="menu" />
    <MenuItem
      text="Client Versions"
      onClick={() => {
        console.log('Client Versions');
      }}
    />
    <HorizontalLine type="menu" />
    <MenuItem
      text="Switch Client"
      onClick={() => {
        console.log('Switch Client');
      }}
      disabled
    />
  </Menu>
);
