import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { NodeIcon } from './NodeIcon';

export interface SidebarNodeItemProps {
  /**
   * Node title
   */
  title: string;
  /**
   * Node info
   */
  info?: string;
  /**
   * Which icon? // TODO: Change this to drop down eventually
   */
  iconId: NodeIconId;
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * What's the status?
   */
  status?: 'healthy' | 'warning' | 'error' | 'sync';
  /**
   * Optional click handler
   */
  // onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const SidebarNodeItem = ({
  // onClick,
  darkMode,
  title,
  info,
  iconId,
  status,
}: SidebarNodeItemProps) => {
  const darkStyle = darkMode ? 'darkMode' : '';
  return (
    <div className={['storybook-sidebar-node-item', `${darkStyle}`].join(' ')}>
      <NodeIcon
        iconId={iconId}
        status={status}
        darkMode={darkMode}
        size="small"
      />
      <div className="storybook-sidebar-node-item-container">
        <div className="storybook-sidebar-node-item-title">{title}</div>
        <div className="storybook-sidebar-node-item-info">{info}</div>
      </div>
    </div>
  );
};
