import { container } from './tabItem.css';

export interface TabItemProps {
  /**
   * What's the current active tab id?
   */
  activeTabId: string;

  /**
   * Required tab label
   */
  label: string;

  /**
   * Tab action
   */
  onClickTabItem: (tab: string) => void;
}

const TabItem = ({ activeTabId, label, onClickTabItem }: TabItemProps) => {
  const onClickAction = () => {
    onClickTabItem(label);
  };
  const tabActiveStyle = activeTabId === label ? 'active' : '';
  return (
    <li
      className={[container, tabActiveStyle].join(' ')}
      onClick={onClickAction}
      onKeyDown={onClickAction}
      role="tab"
      tabIndex={0}
    >
      {label}
    </li>
  );
};

export default TabItem;
