/* eslint-disable react/destructuring-assignment */
// Options replaceable component docs:
// https://react-select.com/components#Option
import Select, { OptionProps, ValueContainerProps } from 'react-select';
import { NodeIconId } from '../../../assets/images/nodeIcons';
import { SelectCard } from '../SelectCard/SelectCard';

const Option = (props: OptionProps) => {
  return (
    <div style={{ height: 75 }} ref={props.innerRef} {...props.innerProps}>
      <SelectCard {...props.data} />
    </div>
  );
};

const SingleValue = ({ children, ...props }: ValueContainerProps) => {
  const nething = props.getValue();

  return (
    <div
      style={{
        height: 75,
        width: '100%',
      }}
      {...props.innerProps}
    >
      <SelectCard {...nething[0]} />

      {/* {`${nething[0]?.label} ${nething[0]?.value}`} */}
    </div>
  );
};

const ecOptions = [
  {
    iconId: 'geth',
    value: 'geth',
    label: 'Geth',
    title: 'Geth',
    info: 'Execution Client',
    onClick() {
      console.log('hello');
    },
  },
  {
    iconId: 'erigon',
    value: 'erigon',
    label: 'Erigon',
    title: 'Erigon',
    info: 'Execution Client',
  },
  {
    iconId: 'nethermind',
    value: 'nethermind',
    label: 'Nethermind',
    title: 'Nethermind',
    info: 'Execution Client',
  },
  {
    iconId: 'besu',
    value: 'besu',
    label: 'Besu',
    title: 'Besu',
    info: 'Execution Client',
    minority: true,
    onClick() {
      console.log('hello');
    },
  },
];
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
        hideSelectedOptions
        defaultValue={ecOptions[0]}
        options={ecOptions}
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
