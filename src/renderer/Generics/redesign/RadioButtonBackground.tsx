export interface RadioButtonBackgroundProps {
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * Is there a children component?
   */
  children?: JSX.Element;
}

/**
 * Primary UI component for user interaction
 */
export const RadioButtonBackground = ({
  darkMode,
  children,
}: RadioButtonBackgroundProps) => {
  const darkStyle = darkMode ? 'darkMode' : '';
  return (
    <label
      className={['storybook-radio-button-background', `${darkStyle}`].join(
        ' '
      )}
    >
      {/* TODO: Add dark mode CSS */}
      {/* TODO: Make value and name flexible to handle different data */}
      {/* TODO: Add click handle */}
      <input type="radio" name="gender" value="male" />
      <div className="value">{children}</div>
    </label>
  );
};
