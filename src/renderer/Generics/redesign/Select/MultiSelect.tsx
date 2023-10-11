import { useEffect, useState } from 'react';
import ReactSelect, {
  MenuPlacement,
  MultiValue,
  SingleValue,
  StylesConfig,
} from 'react-select';
import { vars } from '../theme.css';

type SelectOption = { value: string; label: string };

type Props = {
  isDisabled: boolean;
  options: SelectOption[];
  value: undefined | string | string[];
  onChange: (newValue?: string | string[]) => void;
  isMulti: boolean;
  menuPlacement?: string;
};
const MultiSelect = ({
  isDisabled,
  options,
  value,
  onChange,
  isMulti,
  menuPlacement,
}: Props) => {
  const [sSelectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    // if no value is set in the prop, show the default value
    // (ex. if no value is set in the node's config, show the node spec default value)
    if (Array.isArray(value)) {
      setSelectedOptions(
        options.filter((option) => {
          return value.includes(option.value);
        }),
      );
    } else {
      setSelectedOptions(
        options.filter((option) => {
          return value === option.value;
        }),
      );
    }
  }, [value, options]);

  const customStyles: StylesConfig<any, true> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: vars.color.background,
      color: vars.color.font,
      borderColor: vars.color.border,
      boxShadow: 'none',
      '&:hover': {
        borderColor: vars.color.primary,
        outline: 0,
        boxShadow: '0 0 0 2px rgba(115, 81, 235, 0.25)',
      },
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: vars.color.background,
    }),
    option: (styles) => ({
      ...styles,
      backgroundColor: vars.color.font8,
      color: vars.color.font85,
      ':active': {
        backgroundColor: vars.color.font8,
      },
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: vars.color.font8,
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      fontSize: 13,
      color: vars.color.font85,
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: vars.color.font85,
      ':hover': {
        backgroundColor: vars.color.font8,
        color: vars.color.font85,
      },
    }),
  };

  return (
    <div style={{ color: 'initial' }}>
      <ReactSelect
        value={sSelectedOptions}
        options={options}
        styles={customStyles}
        // @ts-ignore
        onChange={(
          newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
        ) => {
          console.log('onChange newValue: ', newValue);
          if (Array.isArray(newValue)) {
            // return array of values
            onChange(
              newValue.map((selectOption) => {
                return selectOption.value;
              }),
            );
          } else {
            const singleValue = newValue as SingleValue<SelectOption>;
            onChange(singleValue?.value ? singleValue.value : undefined);
          }
        }}
        isDisabled={isDisabled}
        isMulti={isMulti}
        menuPlacement={menuPlacement as MenuPlacement}
      />
    </div>
  );
};
MultiSelect.defaultProps = {
  menuPlacement: 'bottom',
};
export default MultiSelect;
