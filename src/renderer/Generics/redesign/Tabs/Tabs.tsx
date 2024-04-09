import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import TabItem from '../TabItem/TabItem';
import { container, tabContent, tabsContainer, tabsList } from './tabs.css';

export interface TabsProps {
  modal?: boolean;
  id?: string;
  children: React.ReactElement[];
}

export const Tabs = ({ children, id, modal }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(
    id || (Array.isArray(children) ? children[0].props.id : null),
  );

  // if the children change and the current active tab isn't available,
  //  then select the first tab if available
  useEffect(() => {
    if (activeTab) {
      if (
        children.length > 0 &&
        !children.find((child) => child.props?.id === activeTab)
      ) {
        setActiveTab(children[0].props.id);
      }
    }
  }, [activeTab, children]);

  const onClickTabItem = useCallback((tab: string | undefined) => {
    setActiveTab(tab);
  }, []);

  if (children === null) {
    return null;
  }

  const modalStyle = modal ? 'modal' : '';

  return (
    <div className={container}>
      <div className={[tabsContainer, modalStyle].join(' ')}>
        <ol className={[tabsList, modalStyle].join(' ')}>
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
