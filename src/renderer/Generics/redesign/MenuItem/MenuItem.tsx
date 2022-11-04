import { IconId } from 'renderer/assets/images/icons';
import { useState } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import { Icon } from '../Icon/Icon';
import { container, menuItemText, statusDot } from './menuItem.css';

export interface MenuItemProps {
  /**
   * What's the width?
   */
  text: string;
  /**
   * Is theres status?
   */
  status?: string;
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
  status,
  selected,
  disabled = false,
  onClick,
}: MenuItemProps) => {
  const [isChecked, setChecked] = useState(false);
  const disabledStyle = disabled ? 'disabled' : '';

  const onClickAction = () => {
    if (!disabled && onClick) {
      onClick();
      if (variant === 'checkbox') {
        setChecked(!isChecked);
      }
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={onClickAction}
      className={[container, `${disabledStyle}`].join(' ')}
      onClick={onClickAction}
    >
      {variant === 'checkbox' && <Checkbox checked={isChecked} />}
      {status && <div className={[statusDot, `${status}`].join(' ')} />}
      <div className={menuItemText}>{text}</div>
    </div>
  );
};
