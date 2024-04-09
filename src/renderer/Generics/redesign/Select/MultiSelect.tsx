import { useEffect, useState } from 'react';
import ReactSelect, {
  type CSSObjectWithLabel,
  type MenuPlacement,
  type MultiValue,
  type SingleValue,
  type StylesConfig,
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
    control: (styles) => {
      return {
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
      } as CSSObjectWithLabel;
    },
    menu: (styles) => {
      return {
        ...styles,
        backgroundColor: vars.color.background,
      } as CSSObjectWithLabel;
    },
    option: (styles) => {
      return {
        ...styles,
        backgroundColor: vars.color.font8,
        color: vars.color.font85,
        ':active': {
          backgroundColor: vars.color.font8,
        },
      } as CSSObjectWithLabel;
    },
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: vars.color.font8,
      } as CSSObjectWithLabel;
    },
    multiValueLabel: (styles) => {
      return {
        ...styles,
        fontSize: 13,
        color: vars.color.font85,
      } as CSSObjectWithLabel;
    },
    multiValueRemove: (styles) => {
      return {
        ...styles,
        color: vars.color.font85,
        ':hover': {
          backgroundColor: vars.color.font8,
          color: vars.color.font85,
        },
      } as CSSObjectWithLabel;
    },
  };

  return (
    <div style={{ color: 'initial' }}>
      <ReactSelect
        value={sSelectedOptions}
        options={options}
        styles={customStyles}
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
