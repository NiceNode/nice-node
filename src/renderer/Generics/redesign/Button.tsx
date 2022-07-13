import { ICONS } from '../../assets/icons';

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What state is the button in?
   */
  disabled?: boolean;
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Text only, with icon, or just icon?
   */
  variant?: 'text' | 'icon-left' | 'icon-right' | 'icon';
  /**
   * Which icon? // TODO: Change this to drop down eventually
   */
  icon?: 'settings' | 'play';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  disabled = false,
  darkMode = false,
  variant = 'text',
  icon = 'settings',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary';
  const darkStyle = darkMode ? 'darkMode' : '';
  return (
    <button
      type="button"
      className={[
        'storybook-button',
        `storybook-button--${size}`,
        mode,
        `${darkStyle}`,
        `${variant}`,
      ].join(' ')}
      disabled={disabled}
      style={{ backgroundColor }}
      {...props}
    >
      {variant !== 'text' && (
        <i
          style={{
            WebkitMaskImage: `url(${ICONS[icon]})`,
            maskImage: `url(${ICONS[icon]})`,
          }}
          className={['storybook-button-icon', `${variant}`].join(' ')}
        />
      )}

      {variant !== 'icon' && (
        <span className={['storybook-button-text', `${variant}`].join(' ')}>
          {label}
        </span>
      )}
    </button>
  );
};
