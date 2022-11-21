import { useState } from 'react';

import { baseTab, idleTab, activeTab } from './tabItem.css';

export interface TabItemProps {
  /**
   * Is this the active tab?
   */
  active?: boolean;

  /**
   * Required tab label
   */
  label: string;
}

const TabItem = ({ active = false, label }: TabItemProps) => {
  const [tabState, setTabState] = useState(active ? activeTab : idleTab);
  const classNames = [baseTab, tabState];
  const onClickAction = () => {
    setTabState(activeTab);
  };
  return (
    <span
      className={classNames.join(' ')}
      onClick={onClickAction}
      onKeyDown={onClickAction}
      role="tab"
      tabIndex={0}
    >
      {label}
    </span>
  );
};

export default TabItem;
