import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import {
  container,
  iconContainer,
  textContainer,
  titleStyle,
  infoStyle,
} from './sideBarNodeItem.css';

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
    <div className={container}>
      <div className={iconContainer}>
        <NodeIcon iconId={iconId} status={status} size="small" />
      </div>
      <div className={textContainer}>
        <div className={titleStyle}>{title}</div>
        <div className={infoStyle}>{info}</div>
      </div>
    </div>
  );
};
