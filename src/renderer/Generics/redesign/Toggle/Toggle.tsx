import { useState } from 'react';
import { container } from './toggle.css';

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
   * Optional change handler
   */
  onChange?: (b: boolean) => void;
}

/**
 * Primary UI component for user interaction
 */
export const Toggle = ({ checked, disabled, onChange }: ToggleProps) => {
  const [isChecked, setChecked] = useState(checked);
  return (
    <input
      {...{
        className: container,
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
