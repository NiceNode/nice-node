import { useState } from 'react';

export interface ToggleProps {
  /**
   * Is it disabled?
   */
  disabled?: boolean;
  /**
   * Is it checked?
   */
  checked?: boolean;
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * Optional change handler
   */
  onChange?: (b: boolean) => void;
}

/**
 * Primary UI component for user interaction
 */
export const Toggle = ({
  checked,
  disabled,
  darkMode,
  onChange,
}: ToggleProps) => {
  const [isChecked, setChecked] = useState(checked);
  const darkStyle = darkMode ? 'darkMode' : '';
  return (
    <input
      {...{
        className: ['storybook-toggle-input', `${darkStyle}`].join(' '),
        type: 'checkbox',
        role: 'switch',
        id: 'flexSwitchCheckDefault',
        defaultChecked: isChecked,
        ...(disabled && { disabled }),
        onChange: () => {
          setChecked(!isChecked);
          if (onChange) {
            onChange(!isChecked);
          }
        },
      }}
    />
  );
};
