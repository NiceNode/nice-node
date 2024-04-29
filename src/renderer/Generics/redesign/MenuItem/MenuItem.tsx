import { useEffect, useState } from 'react';
import type { IconId } from '../../../assets/images/icons';
import { Checkbox } from '../Checkbox/Checkbox';
import { Icon } from '../Icon/Icon';
import { container, menuItemText, selectIcon, statusDot } from './menuItem.css';

export interface MenuItemProps {
  /**
   * What's the width?
   */
  text: string;
  /**
   * IconId?
   */
  iconId?: IconId;
  /**
   * Is theres status?
   */
  status?: string;
  /**
   * Which variant?
   */
  variant?: 'text' | 'checkbox';
  /**
   * Is this selectable?
   */
  selectable?: boolean;
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
  iconId,
  text,
  variant = 'text',
  status,
  selectable,
  selected,
  disabled = false,
  onClick,
}: MenuItemProps) => {
  const [isChecked, setChecked] = useState(selected);
  const disabledStyle = disabled ? 'disabled' : '';

  useEffect(() => {
    setChecked(selected);
  }, [selected]);

  const onClickAction = (event: { preventDefault?: () => void }) => {
    // This prevents html from firing this handler multiple times on click due to event "bubbling"
    if (event.preventDefault) {
      event.preventDefault();
    }

    if (!disabled && onClick) {
      onClick();
      if (selectable) {
        setChecked(!isChecked);
      }
    }
  };

  return (
    <label
      tabIndex={0}
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: <explanation>
      role="button"
      onKeyDown={onClickAction}
      className={[container, `${disabledStyle}`].join(' ')}
      onClick={onClickAction}
      onBlur={() => {
        if (selectable) {
          setChecked(false);
        }
      }}
    >
      {variant === 'checkbox' && <Checkbox checked={isChecked} />}
      {iconId && (
        <div>
          <Icon iconId={iconId} />
        </div>
      )}
      {status && <div className={[statusDot, `${status}`].join(' ')} />}
      <div className={menuItemText}>{text}</div>
      {variant === 'text' && selectable && isChecked && (
        <div className={selectIcon}>
          <Icon iconId="check" />
        </div>
      )}
    </label>
  );
};
