import { IconId } from '../../../assets/images/icons';
import { Icon } from '../Icon/Icon';
import { baseButton, iconLeft, iconStyle } from './floatingButton.css';

export interface FloatingButtonProps {
  /**
   * Text only, with icon, or just icon?
   */
  variant?: 'text' | 'icon-left' | 'icon-right' | 'icon';
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

const FloatingButton = ({
  variant = 'text',
  iconId = 'settings',
  label,
  ...props
}: FloatingButtonProps) => {
  return (
    <button
      type="button"
      className={[baseButton, variant].join(' ')}
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

export default FloatingButton;
