import { IconId } from 'renderer/assets/images/icons';
import { Icon } from '../Icon/Icon';
import {
  baseButton,
  primaryButton,
  secondaryButton,
  smallButton,
  wideButton,
  iconLeft,
  iconStyle,
  ghostButton,
  dangerButton,
} from './button.css';

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
  ghost?: boolean;
  size?: 'small' | 'medium' | 'large';
  /**
   * Text only, with icon, or just icon?
   */
  variant?: 'text' | 'icon-left' | 'icon-right' | 'icon';
  /**
   * Type of button, determines styling and color
   */
  type?: 'primary' | 'secondary' | 'ghost' | 'danger';
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
  type = 'secondary',
  iconId = 'settings',
  wide = false,
  ghost = false,
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  // initialization makes type backwards compatible with primary
  let buttonStyle = primary ? primaryButton : secondaryButton;
  if (type === 'secondary') {
    buttonStyle = secondaryButton;
  } else if (type === 'primary') {
    buttonStyle = primaryButton;
  } else if (type === 'ghost') {
    buttonStyle = ghostButton;
  } else if (type === 'danger') {
    buttonStyle = dangerButton;
  }
  if (ghost) {
    buttonStyle = ghostButton;
  }
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
      {variant !== 'text' && (
        <div className={iconStyle}>
          <Icon iconId={iconId} />
        </div>
      )}
    </button>
  );
};

export default Button;
