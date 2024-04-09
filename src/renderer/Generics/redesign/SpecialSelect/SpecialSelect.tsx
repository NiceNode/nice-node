/* eslint-disable react/destructuring-assignment */
// Options replaceable component docs:
// https://react-select.com/components#Option
import { useEffect, useState } from 'react';
import Select, {
  type CSSObjectWithLabel,
  type OptionProps,
  type ValueContainerProps,
} from 'react-select';
import SelectCard, { type SelectCardProps } from '../SelectCard/SelectCard';
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

const emptyComponentPlaceholder = () => <></>;
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

  // update internal state when prop changes
  useEffect(() => {
    setSelectedOption(selectedOption);
  }, [selectedOption]);

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
          IndicatorsContainer: emptyComponentPlaceholder,
        }}
        styles={{
          container: (base) => {
            return {
              ...base,
              width: '100%',
            } as CSSObjectWithLabel;
          },
          control: (base) => {
            return {
              ...base,
              backgroundColor: 'inherit',
              border: 'none',
              boxShadow: 'none',
              ':hover': {
                border: 'none',
                boxShadow: 'none',
              },
            } as CSSObjectWithLabel;
          },
          menu: (base) => {
            return {
              ...base,
              backgroundColor: vars.color.background,
              marginTop: 0,
              borderTop: 0,
              boxShadow: '0px 14px 16px rgba(0, 0, 0, 0.14)',
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
        }}
      />
    </>
  );
};
export default SpecialSelect;
