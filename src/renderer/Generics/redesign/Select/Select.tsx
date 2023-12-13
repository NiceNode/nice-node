/* eslint-disable react/destructuring-assignment */
// React select docs at:
// https://react-select.com/components#Option
import { useState, useCallback, useEffect } from 'react';
import ReactSelect, {
  CSSObjectWithLabel,
  MenuPlacement,
  SingleValue,
} from 'react-select';
import { Icon } from '../Icon/Icon';
import { vars } from '../theme.css';

export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  isDisabled?: boolean;
  // onChange?: (
  //   newValue: SingleValue<{
  //     value: string;
  //     label: string;
  //   }>,
  //   actionMeta: ActionMeta<{
  //     value: string;
  //     label: string;
  //   }>
  // ) => void | undefined;
  onChange?: (
    newValue:
      | SingleValue<{
          value: string;
          label: string;
        }>
      | undefined,
  ) => unknown;
  menuPlacement?: MenuPlacement;
}

const IndicatorsContainer = () => (
  <div style={{ marginRight: 5 }}>
    <Icon iconId="popup" />
  </div>
);

const Select = ({
  onChange,
  options,
  value,
  isDisabled,
  menuPlacement,
}: SelectProps) => {
  const [sSelectedOption, setSelectedOption] = useState<SelectOption>();

  useEffect(() => {
    const selectedOption = options.find((option) => option.value === value);
    setSelectedOption(selectedOption);
  }, [options, value]);
  // const selectedOption = options.find((option) => option.value === value);

  const onChangeReactSelect = useCallback(
    (newOption: SingleValue<SelectOption>) => {
      setSelectedOption(newOption as SelectOption);
      if (onChange) onChange(newOption);
    },
    [onChange],
  );

  return (
    <>
      <ReactSelect
        menuPlacement={menuPlacement ?? 'bottom'}
        isDisabled={isDisabled}
        onChange={onChangeReactSelect}
        hideSelectedOptions
        value={sSelectedOption}
        defaultValue={options[0] ?? undefined}
        options={options}
        isSearchable={false}
        components={{
          IndicatorsContainer,
        }}
        styles={{
          control: (base) => {
            return {
              ...base,
              backgroundColor: isDisabled
                ? vars.color.backgroundDisabled
                : 'inherit',
              color: isDisabled ? vars.color.fontDisabled : 'inherit',
              borderColor: vars.color.border,
              boxShadow: 'none',
              ':hover': {
                borderColor: vars.color.border15,
                boxShadow: 'none',
                color: vars.color.font50,
              },
              minHeight: 28,
            } as CSSObjectWithLabel;
          },
          menu: (base) => {
            return {
              ...base,
              width: 'auto', // makes menu as wide as longest option name
              backgroundColor: vars.color.background,
              marginTop: 0,
              borderTop: 0,
              boxShadow: '0px 14px 16px rgba(0, 0, 0, 0.14)',
              zIndex: 100,
            } as CSSObjectWithLabel;
          },
          option: (base) => {
            return {
              ...base,
              backgroundColor: 'inherit',
              ':hover': {
                backgroundColor: vars.color.background96,
              },
            } as CSSObjectWithLabel;
          },
          dropdownIndicator: () => ({
            display: 'none',
          }),
          valueContainer: (base) => {
            return {
              ...base,
              padding: 0,
              // https://github.com/JedWatson/react-select/issues/3995#issuecomment-738470183
              input: {
                gridArea: 'auto',
                height: 0,
              },
            } as CSSObjectWithLabel;
          },
          singleValue: (base) => {
            return {
              ...base,
              color: 'inherit',
              marginLeft: 8,
              lineHeight: '16px',
            } as CSSObjectWithLabel;
          },
        }}
      />
    </>
  );
};
export default Select;
