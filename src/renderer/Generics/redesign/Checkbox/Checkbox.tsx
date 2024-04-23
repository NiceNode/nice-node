import { useEffect, useState } from 'react';
import { checkbox, container } from './checkbox.css';

export interface CheckboxProps {
  /**
   * Label text
   */
  label?: string;
  /**
   * Is it checked?
   */
  checked?: boolean;
  /**
   * Is this disabled?
   */
  disabled?: boolean;
  /**
   * Optional change handler
   */
  onClick?: (isChecked: boolean) => void;
}

/**
 * Primary UI component for user interaction
 */
export const Checkbox = ({
  label,
  checked = false,
  disabled = false,
  onClick,
}: CheckboxProps) => {
  const [sIsChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const disabledStyle = disabled ? 'disabled' : '';
  // TODO: implement indeterminate
  return (
    <div className={[container, `${disabledStyle}`].join(' ')}>
      <input
        {...{
          id: 'checkboxComponent',
          className: checkbox,
          type: 'checkbox',
          // TODO: fix checked when text is pressed in MenuItem
          checked: sIsChecked,
          ...(disabled && { disabled }),
          onChange: () => {
            // protect against unpredictable state update occurring
            //   before or after onClick callback
            const isCheckedBeforeAction = sIsChecked;
            setIsChecked(!isCheckedBeforeAction);
            if (onClick && !disabled) {
              onClick(!isCheckedBeforeAction);
            }
          },
        }}
      />
      {label && <label htmlFor="checkboxComponent">{label}</label>}
    </div>
  );
};
