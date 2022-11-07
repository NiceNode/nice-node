/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { container, checkbox } from './checkbox.css';

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
  onClick?: () => void;
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
  const onChangeAction = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const [isChecked, setChecked] = useState(checked);
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
          checked: isChecked,
          defaultChecked: isChecked,
          ...(disabled && { disabled }),
          onChange: () => {
            setChecked(!isChecked);
            if (onClick) {
              onChangeAction();
            }
          },
        }}
      />
      {label && <label htmlFor="checkboxComponent">{label}</label>}
    </div>
  );
};
