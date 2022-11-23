import React, { useState } from 'react';
import { container, tabsList, tabContent } from './tabs.css';
import TabItem from '../TabItem/TabItem';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';

export interface TabsProps {
  modal?: boolean;
  id?: string;
  children: React.ReactNode[];
}

export const Tabs = ({ children, id, modal }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    id || children[0].props.id
  );

  const onClickTabItem = (tab: string) => {
    setActiveTab(tab);
  };

  if (children === null) {
    return null;
  }

  const modalStyle = modal ? 'modal' : '';

  return (
    <div className={container}>
      <ol className={tabsList}>
        {children.map((child) => {
          const { id } = child.props;

          return (
            <TabItem
              activeTabId={activeTab}
              key={id}
              label={id}
              onClickTabItem={onClickTabItem}
            />
          );
        })}
      </ol>
      <HorizontalLine />
      <div className={[tabContent, modalStyle].join(' ')}>
        {children.map((child) => {
          if (child.props.id !== activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};
