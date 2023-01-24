import React, { useState } from 'react';
import { container, tabsList, tabsContainer, tabContent } from './tabs.css';
import TabItem from '../TabItem/TabItem';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';

export interface TabsProps {
  modal?: boolean;
  id?: string;
  children: React.ReactElement[];
}

export const Tabs = ({ children, id, modal }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(
    id || (Array.isArray(children) ? children[0].props.id : null)
  );

  const onClickTabItem = (tab: string | undefined) => {
    setActiveTab(tab);
  };

  if (children === null) {
    return null;
  }

  const modalStyle = modal ? 'modal' : '';

  return (
    <div className={container}>
      <div className={[tabsContainer, modalStyle].join(' ')}>
        <ol className={tabsList}>
          {children.map((child) => {
            const childId = child.props.id;

            return (
              <TabItem
                activeTabId={activeTab}
                key={childId}
                label={childId}
                onClickTabItem={onClickTabItem}
              />
            );
          })}
        </ol>
        <HorizontalLine />
      </div>
      <div className={[tabContent, modalStyle].join(' ')}>
        {children.map((child) => {
          if (child.props.id !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};