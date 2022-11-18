import React, { useState } from 'react';
import { container, tabsList, tabContent } from './tabs.css';
import { Tab } from './Tab';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';

export interface TabsProps {
  children: React.ReactNode[];
}

export const Tabs = ({ children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(children[0].props.label);

  const onClickTabItem = (tab) => {
    setActiveTab(tab);
  };

  if (children === null) {
    return null;
  }

  return (
    <div className={container}>
      <ol className={tabsList}>
        {children.map((child) => {
          const { label } = child.props;

          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClickTabItem={onClickTabItem}
            />
          );
        })}
      </ol>
      <HorizontalLine />
      <div className={tabContent}>
        {children.map((child) => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};
