import { useState } from 'react';
import { IconId } from 'renderer/assets/images/icons';
import { Bubble } from '../Bubble/Bubble';
import { Icon } from '../Icon/Icon';
import { container, selectedContainer, labelText } from './sidebarLinkItem.css';

export interface SidebarLinkItemProps {
  /**
   * Button contents
   */
  label: string;
  /**
   * Button contents
   */
  count?: number;
  /**
   * Which icon?
   */
  iconId?: IconId;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const SidebarLinkItem = ({
  onClick,
  label,
  count,
  iconId = 'bell',
}: SidebarLinkItemProps) => {
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
      <Icon iconId={iconId} />
      <div className={labelText}>{label}</div>
      {count && <Bubble count={count} />}
    </div>
  );
};
