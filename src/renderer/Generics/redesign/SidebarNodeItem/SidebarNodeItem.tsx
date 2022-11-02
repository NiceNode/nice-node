import { useState } from 'react';
import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import {
  container,
  selectedContainer,
  iconContainer,
  textContainer,
  titleStyle,
  infoStyle,
} from './sideBarNodeItem.css';

export type SidebarNodeStatus =
  | 'healthy'
  | 'warning'
  | 'error'
  | 'sync'
  | 'stopped';
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
   * Which icon?
   */
  iconId: NodeIconId;
  /**
   * What's the status?
   */
  status?: SidebarNodeStatus;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const SidebarNodeItem = ({
  onClick,
  title,
  info,
  iconId,
  status,
}: SidebarNodeItemProps) => {
  const [selected, setSelected] = useState(false);

  const onClickAction = () => {
    setSelected(true);
    if (onClick) {
      onClick();
    }
  };

  const containerStyles = [container];
  if (selected) {
    containerStyles.push(selectedContainer);
  }

  return (
    <div
      className={containerStyles.join(' ')}
      onClick={onClickAction}
      onBlur={() => {
        setSelected(false);
      }}
      onKeyDown={onClickAction}
      role="button"
      tabIndex={0}
    >
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
