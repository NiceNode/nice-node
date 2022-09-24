/* eslint-disable react/destructuring-assignment */
// Options replaceable component docs:
// https://react-select.com/components#Option
import Select, { OptionProps, ValueContainerProps } from 'react-select';
import { SelectCard } from '../SelectCard';

const Option = (props: OptionProps) => {
  return (
    <div
      style={{ height: 75, background: 'grey' }}
      ref={props.innerRef}
      {...props.innerProps}
    >
      Test1
    </div>
  );
};

const SingleValue = ({ children, ...props }: ValueContainerProps) => {
  const nething = props.getValue();

  return (
    <div
      style={{
        height: 75,
        background: 'grey',
        width: '100%',
      }}
      {...props.innerProps}
    >
      {`${nething[0]?.label} ${nething[0]?.value}`}
    </div>
  );
};

const options = [
  { value: 'lodestar', label: 'lodestar', storage: 100, minory: true },
  { value: 'prysm', label: 'prysm', storage: 1000 },
  { value: 'teku', label: 'teku', minory: true, storage: 9009 },
  { value: 'lighthouse', label: 'lighthouse', storage: 1 },
  { value: 'nimbus', label: 'nimbus', storage: 69 },
];
export interface SpecialSelectProps {
  onChange: (newValue: string) => void;
}

/**
 * Use for selecting Ethereum node client
 */
const SpecialSelect = ({ onChange, ...props }: SpecialSelectProps) => {
  return (
    <>
      <Select
        // hideSelectedOptions
        defaultValue={options[0]}
        options={options}
        isSearchable={false}
        components={{
          Option,
          SingleValue,
          IndicatorsContainer: () => <></>,
        }}
        styles={{
          control: (base) => ({
            ...base,
            border: 'none',
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
