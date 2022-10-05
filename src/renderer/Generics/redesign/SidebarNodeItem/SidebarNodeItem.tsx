import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { NodeIcon } from '../NodeIcon/NodeIcon';

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
   * What's the status?
   */
  status?: 'healthy' | 'warning' | 'error' | 'sync';
}

/**
 * Primary UI component for user interaction
 */
export const SidebarNodeItem = ({
  title,
  info,
  iconId,
  status,
}: SidebarNodeItemProps) => {
  return (
    <div className={['storybook-sidebar-node-item'].join(' ')}>
      <NodeIcon iconId={iconId} status={status} size="small" />
      <div className="storybook-sidebar-node-item-container">
        <div className="storybook-sidebar-node-item-title">{title}</div>
        <div className="storybook-sidebar-node-item-info">{info}</div>
      </div>
    </div>
  );
};
