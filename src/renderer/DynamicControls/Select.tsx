import { useEffect, useState } from 'react';
import ReactSelect, { MultiValue, SingleValue } from 'react-select';

type SelectOption = { value: string; label: string };

type Props = {
  isDisabled: boolean;
  options: SelectOption[];
  value: undefined | string | string[];
  defaultValue?: undefined | string | string[];
  onChange: (newValue?: string | string[]) => void;
  isMulti: boolean;
};
const Select = ({
  isDisabled,
  options,
  value,
  onChange,
  isMulti,
  defaultValue,
}: Props) => {
  const [sSelectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
  const [sDefaultValueOptions, setDefaultValueOptions] = useState<
    SelectOption[]
  >([]);

  useEffect(() => {
    // if no value is set in the prop, show the default value
    // (ex. if no value is set in the node's config, show the node spec default value)
    if (value === undefined) {
      console.log('value is undefined: using defaultValue: ', defaultValue);
      if (Array.isArray(defaultValue)) {
        // return array of values
        setDefaultValueOptions(
          options.filter((option) => {
            return defaultValue.includes(option.value);
          })
        );
        // onChange(newValue.value);
      } else {
        setDefaultValueOptions(
          options.filter((option) => {
            return defaultValue === option.value;
          })
        );
      }
    } else if (Array.isArray(value)) {
      setSelectedOptions(
        options.filter((option) => {
          return value.includes(option.value);
        })
      );
    } else {
      setSelectedOptions(
        options.filter((option) => {
          return value === option.value;
        })
      );
    }
  }, [value, options, defaultValue]);

  return (
    <div style={{ color: 'initial' }}>
      <ReactSelect
        value={sSelectedOptions}
        defaultValue={sDefaultValueOptions}
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
