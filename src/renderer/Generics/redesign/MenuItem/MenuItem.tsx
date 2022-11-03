import { IconId } from 'renderer/assets/images/icons';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import { Icon } from '../Icon/Icon';
import { container, menuItemText } from './menuItem.css';

export interface MenuItemProps {
  /**
   * What's the width?
   */
  text: string;
  /**
   * Which variant?
   */
  variant?: 'text' | 'checkbox';
  /**
   * Is this selected?
   */
  selected?: boolean;
  /**
   * Is this disabled?
   */
  disabled?: boolean;
  /**
   * Menu Items?
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const MenuItem = ({
  text,
  variant = 'text',
  selected,
  disabled = false,
  onClick,
}: MenuItemProps) => {
  const onClickAction = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };
  const disabledStyle = disabled ? 'disabled' : '';
  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={onClickAction}
      className={[container, `${disabledStyle}`].join(' ')}
      onClick={onClickAction}
    >
      <div className={menuItemText}>{text}</div>
    </div>
  );
};
