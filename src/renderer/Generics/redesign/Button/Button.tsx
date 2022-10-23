import { IconId } from 'renderer/assets/images/icons';
import { Icon } from '../Icon/Icon';
import {
  baseButton,
  primaryButton,
  secondaryButton,
  smallButton,
  wideButton,
  iconLeft,
} from './button.css';

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  /**
   * Text only, with icon, or just icon?
   */
  variant?: 'text' | 'icon-left' | 'icon-right' | 'icon';
  /**
   * Is this button wide?
   */
  wide?: boolean;
  /**
   * Optional icon
   */
  iconId?: IconId;
  /**
   * Button text content
   */
  label?: string;
  onClick?: () => void;
}

const Button = ({
  primary = false,
  size = 'medium',
  disabled = false,
  variant = 'text',
  iconId = 'settings',
  wide = false,
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const buttonStyle = primary ? primaryButton : secondaryButton;
  const classNames = [baseButton, buttonStyle];
  if (size === 'small') {
    classNames.push(smallButton);
  }
  if (wide) {
    classNames.push(wideButton);
  }
  return (
    <button
      type="button"
      className={classNames.join(' ')}
      disabled={disabled}
      style={{ backgroundColor }}
      {...props}
    >
      {variant !== 'icon' && (
        <span className={variant === 'icon-left' ? iconLeft : ''}>{label}</span>
      )}
      {variant !== 'text' && <Icon iconId={iconId} />}
    </button>
  );
};

export default Button;
