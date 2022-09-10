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
      {/* TODO: Modify the value/name here */}
      {/* TODO: Add click handle */}
      <input type="radio" name="gender" value="male" />
      <div className="value">{children}</div>
    </label>
  );
};
