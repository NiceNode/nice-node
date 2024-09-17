import { useEffect, useState } from 'react';
import {
  checkboxContainer,
  checkboxLabel,
  checkboxInput,
  customCheckbox,
  svgCheckmark,
  svgIndeterminate,
  checkedCustomCheckbox,
  indeterminateCustomCheckbox,
  disabledCheckbox,
} from './checkbox.css';
import { Icon } from '../Icon/Icon.js';

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
   * Is it in an indeterminate state?
   */
  indeterminate?: boolean;
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
  indeterminate = false,
  disabled = false,
  onClick,
}: CheckboxProps) => {
  const [sIsChecked, setIsChecked] = useState(checked);
  const [sIsIndeterminate, setIsIndeterminate] = useState(indeterminate);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    setIsIndeterminate(indeterminate);
  }, [indeterminate]);

  const handleCheckboxClick = () => {
    if (!disabled) {
      if (sIsIndeterminate) {
        setIsChecked(true);
        setIsIndeterminate(false);
      } else {
        setIsChecked(!sIsChecked);
      }
      if (onClick) {
        onClick(!sIsChecked);
      }
    }
  };

  return (
    <label className={checkboxContainer}>
      <input
        type="checkbox"
        checked={sIsChecked}
        disabled={disabled}
        onChange={handleCheckboxClick}
        className={checkboxInput}
      />
      <span
        className={`${customCheckbox} ${sIsChecked ? checkedCustomCheckbox : ''} ${
          sIsIndeterminate ? indeterminateCustomCheckbox : ''
        } ${disabled ? disabledCheckbox : ''}`}
      >
        {sIsChecked && !sIsIndeterminate && (
          <span className={svgCheckmark}>
            <Icon iconId={'check'} />
          </span>
        )}
        {sIsIndeterminate && (
          <span className={svgIndeterminate}>
            <Icon iconId={'intermediate'} />
          </span>
        )}
      </span>
      {/* biome-ignore lint: labelForCheckbox */}
      {label && <span className={checkboxLabel}>{label}</span>}
    </label>
  );
};
