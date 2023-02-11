/* eslint-disable react/destructuring-assignment */
// Options replaceable component docs:
// https://react-select.com/components#Option
import { useState } from 'react';
import Select, { OptionProps, ValueContainerProps } from 'react-select';
import SelectCard, { SelectCardProps } from '../SelectCard/SelectCard';
import { vars } from '../theme.css';

const Option = (props: OptionProps) => {
  const selectCardProps = props.data as SelectCardProps;
  return (
    <div ref={props.innerRef} {...props.innerProps}>
      <SelectCard {...selectCardProps} />
    </div>
  );
};

const SingleValue = ({ children, ...props }: ValueContainerProps) => {
  const selectedOptionValue = props.getValue();
  const selectCardProps = selectedOptionValue[0] as SelectCardProps;

  return (
    <div {...props.innerProps}>
      <SelectCard {...selectCardProps} />
    </div>
  );
};

export type SelectOption = {
  value: string;
  label: string;
  [x: string]: unknown;
};
export interface SpecialSelectProps {
  options?: SelectOption[];
  onChange?: (newValue: SelectOption | undefined) => void;
  selectedOption: SelectOption;
}

/**
 * Used for selecting Ethereum node client
 */
const SpecialSelect = ({
  options,
  onChange,
  selectedOption,
}: SpecialSelectProps) => {
  const [sSelectedOption, setSelectedOption] =
    useState<SelectOption>(selectedOption);

  const onSelectChange = (newValue: unknown) => {
    const newlySelectedOption = newValue as SelectOption;
    console.log('onSelectChange: ', newlySelectedOption);
    if (onChange) onChange(newlySelectedOption);
    setSelectedOption(newlySelectedOption);
  };

  return (
    <>
      <Select
        onChange={onSelectChange}
        captureMenuScroll={false}
        menuShouldScrollIntoView
        hideSelectedOptions
        value={sSelectedOption}
        options={options}
        isSearchable={false}
        components={{
          Option,
          SingleValue,
          IndicatorsContainer: () => <></>,
        }}
        styles={{
          container: (base) => ({
            ...base,
            width: '100%',
          }),
          control: (base) => ({
            ...base,
            backgroundColor: 'inherit',
            border: 'none',
            boxShadow: 'none',
            ':hover': {
              border: 'none',
              boxShadow: 'none',
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: vars.color.background,
            marginTop: 0,
            borderTop: 0,
            boxShadow: '0px 14px 16px rgba(0, 0, 0, 0.14)',
          }),
          dropdownIndicator: () => ({
            display: 'none',
          }),
          valueContainer: (base) => ({
            ...base,
            padding: 0,
            // https://github.com/JedWatson/react-select/issues/3995#issuecomment-738470183
            input: {
              gridArea: 'auto',
              height: 0,
            },
          }),
        }}
      />
    </>
  );
};
export default SpecialSelect;
