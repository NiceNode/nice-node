import { useEffect, useState } from 'react';
import ReactSelect, { MultiValue, SingleValue } from 'react-select';

type SelectOption = { value: string; label: string };

type Props = {
  isDisabled: boolean;
  options: SelectOption[];
  value: undefined | string | string[];
  onChange: (newValue?: string | string[]) => void;
  isMulti: boolean;
};
const Select = ({ isDisabled, options, value, onChange, isMulti }: Props) => {
  const [sSelectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      // return array of values
      setSelectedOptions(
        options.filter((option) => {
          return value.includes(option.value);
        })
      );
      // onChange(newValue.value);
    } else {
      setSelectedOptions(
        options.filter((option) => {
          return value === option.value;
        })
      );
    }
  }, [value, options]);

  return (
    <div style={{ color: 'initial' }}>
      <ReactSelect
        value={sSelectedOptions}
        options={options}
        onChange={(
          newValue: SingleValue<SelectOption> | MultiValue<SelectOption>
        ) => {
          console.log('onChange newValue: ', newValue);
          if (Array.isArray(newValue)) {
            // return array of values
            onChange(
              newValue.map((selectOption) => {
                return selectOption.value;
              })
            );
            // onChange(newValue.value);
          } else {
            onChange(newValue?.value ? newValue.value : undefined);
          }
        }}
        isDisabled={isDisabled}
        isMulti={isMulti}
      />
      {/* <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option}
            </option>
          );
        })}
      </select> */}
    </div>
  );
};
export default Select;
