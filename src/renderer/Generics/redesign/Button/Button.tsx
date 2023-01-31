import { IconId } from 'renderer/assets/images/icons';
import { Icon } from '../Icon/Icon';
import {
  baseButton,
  primaryButton,
  secondaryButton,
  iconLeft,
  iconStyle,
  ghostButton,
  dangerButton,
} from './button.css';

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  disabled?: boolean;
  backgroundColor?: string;
  spaceBetween?: boolean;
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
  size = 'medium',
  disabled = false,
  variant = 'text',
  type = 'secondary',
  iconId = 'settings',
  spaceBetween = false,
  wide = false,
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  let buttonStyle;
  if (type === 'secondary') {
    buttonStyle = secondaryButton;
  } else if (type === 'primary') {
    buttonStyle = primaryButton;
  } else if (type === 'ghost') {
    buttonStyle = ghostButton;
  } else if (type === 'danger') {
    buttonStyle = dangerButton;
  }
  const classNames = [baseButton, buttonStyle];
  const wideStyle = wide ? 'wide' : '';
  const spaceBetweenStyle = spaceBetween ? 'spaceBetween' : '';

  return (
    <button
      type="button"
      className={[
        classNames.join(' '),
        size,
        wideStyle,
        spaceBetweenStyle,
        variant,
      ].join(' ')}
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
