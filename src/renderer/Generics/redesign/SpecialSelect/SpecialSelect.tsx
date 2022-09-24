/* eslint-disable react/destructuring-assignment */
// Options replaceable component docs:
// https://react-select.com/components#Option
import Select, {
  components,
  OptionProps,
  ValueContainerProps,
} from 'react-select';
import { child } from 'winston';
import { SelectCard } from '../SelectCard';

const Option = (props: OptionProps<ColourOption>) => {
  return (
    // <Tooltip content="Customise your option component!" truncate>
    //   <components.Option {...props} />
    // </Tooltip>
    <div
      style={{ height: 75, background: 'grey', border: '2px solid black' }}
      {...props}
    >
      Test1
      <components.Option {...props}>Test2</components.Option>
    </div>
  );
};

// const ControlContainer = ({ children, ...props }: ValueContainerProps) => {
//   return (
//     <div {...props}>
//       {children}
//       {/* {JSON.stringify(nething)} */}
//     </div>
//   );
// };

const ValueContainer = ({ children, ...props }: ValueContainerProps) => {
  const nething = props.getValue();
  const click = props.selectOption;

  return (
    <div
      // style={{
      //   height: 75,
      //   background: 'grey',
      //   border: '2px solid black',
      //   width: '100%',
      // }}
      {...props}
    >
      {children}
      {/* {JSON.stringify(nething)} */}
    </div>
  );
};

const SingleValue = ({ children, ...props }: ValueContainerProps) => {
  const nething = props.getValue();
  const click = props.selectOption;

  return (
    <div
      style={{
        height: 75,
        background: 'grey',
        border: '2px solid black',
        width: '100%',
      }}
      {...props}
    >
      {nething[0]?.label + nething[0]?.value}
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
      {/* <SelectCard title="Teku" iconId="teku" /> */}
      <Select
        options={options}
        isSearchable={false}
        components={{
          Option,
          SingleValue,
          // ValueContainer,
          // Control: ControlContainer,
        }}
        styles={{
          container: () => ({
            background: 'blue',
            border: 'none',
          }),
          control: () => ({ background: 'red', padding: 0, margin: 0 }),
          dropdownIndicator: () => ({
            display: 'none',
          }),
          clearIndicator: () => ({
            display: 'none',
          }),
          indicatorsContainer: () => ({
            display: 'none',
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          singleValue: (base) => ({
            ...base,
            padding: 0,
            margin: 0,
          }),
          valueContainer: (base) => ({
            ...base,
            border: '1px solid red',
            padding: 0,
            margin: 0,
          }),
        }}
      />
    </>
  );
};
export default SpecialSelect;
