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
  | 'stopped'
  | 'updating';
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
  iconId: NodeIconId | string;
  /**
   * What's the status?
   */
  status?: SidebarNodeStatus;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Is the node selected?
   */
  selected?: boolean;
}

export const SidebarNodeItem = ({
  onClick,
  title,
  info,
  iconId,
  status,
  selected,
}: SidebarNodeItemProps) => {
  const [sInternalSelected, setInternalSelected] = useState(false);

  const onClickAction = () => {
    setInternalSelected(true);
    if (onClick) {
      onClick();
    }
  };

  const containerStyles = [container];
  if (selected || sInternalSelected) {
    containerStyles.push(selectedContainer);
  }

  return (
    <div
      className={containerStyles.join(' ')}
      onClick={onClickAction}
      onBlur={() => {
        setInternalSelected(false);
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
