import { useState } from 'react';

export interface ToggleProps {
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * Button contents
   */
  label?: string | number;
  /**
   * Is it disabled?
   */
  disabled?: boolean;
  /**
   * Is it checked?
   */
  checked?: boolean;
  /**
   * Optional change handler
   */
  onChange?: (b: boolean) => void;
}

/**
 * Primary UI component for user interaction
 */
export const Toggle = ({
  backgroundColor,
  label = '',
  checked,
  disabled,
  onChange,
  ...props
}: ToggleProps) => {
  const [isChecked, setChecked] = useState(checked);
  return (
    <div className="storybook-toggle">
      {/* {label && (
        <label
          className="storybook-toggle-label"
          htmlFor="flexSwitchCheckDefault"
        >
          {label}
        </label>
      )} */}
      <input
        {...{
          className: 'storybook-toggle-input',
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
    </div>
  );
};
