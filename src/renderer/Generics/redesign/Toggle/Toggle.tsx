import { useState, useEffect } from 'react';
import { container, inputContainer, toggleText } from './toggle.css';

export interface ToggleProps {
  /**
   * Is there (on) text to toggle?
   */
  onText?: string;
  /**
   * Is there (off) text to toggle?
   */
  offText?: string;
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
  checked: initialChecked,
  disabled,
  onChange,
  onText,
  offText,
}: ToggleProps) => {
  const [isChecked, setChecked] = useState(initialChecked);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  return (
    <div className={container}>
      {onText && offText && (
        <div className={toggleText}>{isChecked ? onText : offText}</div>
      )}
      <input
        {...{
          className: inputContainer,
          type: 'checkbox',
          role: 'switch',
          id: 'flexSwitchCheckDefault',
          checked: isChecked || false,
          ...(disabled && { disabled }),
          onChange: (e) => {
            if (onChange) {
              onChange(e.target.checked);
            }
          },
        }}
      />
    </div>
  );
};
