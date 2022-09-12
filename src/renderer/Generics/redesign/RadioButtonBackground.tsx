export interface RadioButtonBackgroundProps {
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * Is there a children component?
   */
  children?: JSX.Element;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const RadioButtonBackground = ({
  darkMode,
  children,
  onClick,
}: RadioButtonBackgroundProps) => {
  const darkStyle = darkMode ? 'darkMode' : '';
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="storybook-radio-button-background">
      {/* TODO: Make value and name flexible to handle different data */}
      <input
        type="radio"
        name="gender"
        value="male"
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      />
      <div
        className={[
          'storybook-radio-button-background-contents',
          `${darkStyle}`,
        ].join(' ')}
      >
        {children}
      </div>
    </label>
  );
};
