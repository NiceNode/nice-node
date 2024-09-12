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
            {/* Checkmark SVG */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              title="Checkmark"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
        {sIsIndeterminate && (
          <span className={svgIndeterminate}>
            {/* Indeterminate SVG */}
            <svg
              width="10"
              height="2"
              viewBox="0 0 10 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              title="Indeterminate"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.555664 1C0.555664 0.50908 0.953633 0.111111 1.44455 0.111111H8.55567C9.04659 0.111111 9.44455 0.50908 9.44455 1C9.44455 1.49092 9.04659 1.88889 8.55567 1.88889H1.44455C0.953633 1.88889 0.555664 1.49092 0.555664 1Z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}
      </span>
      {label && <span className={checkboxLabel}>{label}</span>}
    </label>
  );
};
