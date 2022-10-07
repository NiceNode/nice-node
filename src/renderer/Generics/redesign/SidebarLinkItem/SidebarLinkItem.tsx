import { IconId } from 'renderer/assets/images/icons';
import { Bubble } from '../Bubble/Bubble';
import { Icon } from '../Icon/Icon';
import { container, labelText } from './sidebarLinkItem.css';

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
  // onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const SidebarLinkItem = ({
  label,
  count,
  iconId = 'bell',
}: SidebarLinkItemProps) => {
  return (
    <div className={container}>
      <Icon iconId={iconId} />
      <div className={labelText}>{label}</div>
      {count && <Bubble count={count} />}
    </div>
  );
};
