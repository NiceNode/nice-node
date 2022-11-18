import { useState } from '@storybook/addons';
import React from 'react';
import { container } from './tab.css';

export interface TabProps {
  activeTab: string;
  label: string;
  onClickTabItem: (tab: string) => void;
}

export const Tab = ({ activeTab, label, onClickTabItem }: TabProps) => {
  const onTabClick = () => {
    onClickTabItem(label);
  };

  const tabListActive = activeTab === label ? 'active' : '';

  return (
    <li className={[container, tabListActive].join(' ')} onClick={onTabClick}>
      {label}
    </li>
  );
};
