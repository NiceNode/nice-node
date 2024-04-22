import type { Meta, StoryFn } from '@storybook/react';
import { HorizontalLine } from '../../renderer/Generics/redesign/HorizontalLine/HorizontalLine';
import { Menu } from '../../renderer/Generics/redesign/Menu/Menu';
import { MenuItem } from '../../renderer/Generics/redesign/MenuItem/MenuItem';

export default {
  title: 'Generic/Menu',
  component: Menu,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Menu>;

export const Settings: StoryFn<typeof Menu> = () => (
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

export const LogMessageType: StoryFn<typeof Menu> = () => (
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
      status="orange"
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

export const LogMessageTime: StoryFn<typeof Menu> = () => (
  <Menu width={156}>
    <MenuItem
      text="Last 30 minutes"
      selectable
      onClick={() => {
        console.log('Last 30 minutes');
      }}
    />
    <MenuItem
      text="Last hour"
      selectable
      onClick={() => {
        console.log('Last hour');
      }}
    />
    <MenuItem
      text="Last 6 hours"
      selectable
      onClick={() => {
        console.log('Last 6 hours');
      }}
    />
    <MenuItem
      text="Last 12 hours"
      selectable
      onClick={() => {
        console.log('Last 12 hours');
      }}
    />
    <MenuItem
      text="Last day"
      selectable
      onClick={() => {
        console.log('Last day');
      }}
    />
    <MenuItem
      text="Last 3 days"
      selectable
      onClick={() => {
        console.log('Last 3 days');
      }}
    />
    <MenuItem
      text="Last week"
      selectable
      onClick={() => {
        console.log('Last week');
      }}
    />
    <MenuItem
      text="Last month"
      selectable
      onClick={() => {
        console.log('Last month');
      }}
    />
  </Menu>
);
