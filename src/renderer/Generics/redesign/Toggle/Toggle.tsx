import { useState } from 'react';
import { container, inputContainer, toggleText } from './toggle.css';

export interface ToggleProps {
  /**
   * Is there text to toggle?
   */
  text?: { on: string; off: string };
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
export const Toggle = ({ checked, disabled, onChange, text }: ToggleProps) => {
  const [isChecked, setChecked] = useState(checked);
  let displayedText = '';
  if (text) {
    displayedText = isChecked ? text.on : text.off;
  }
  return (
    <div className={container}>
      {text && <div className={toggleText}>{displayedText}</div>}
      <input
        {...{
          className: inputContainer,
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
