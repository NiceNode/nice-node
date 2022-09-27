/* eslint-disable react/destructuring-assignment */
// React select docs at:
// https://react-select.com/components#Option
import ReactSelect, { ActionMeta, SingleValue } from 'react-select';
import { ReactComponent as PopupIcon } from '../../../assets/images/icons/Popup.svg';
import { vars } from '../theme.css';

const options = [
  { value: 'mainnet', label: 'Ethereum Mainnet' },
  { value: 'goerli', label: 'Goerli Testnet' },
  { value: 'sepolia', label: 'Sepolia Testnet' },
];

export interface SelectProps {
  onChange: (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => void | undefined;
}

/**
 * Use for selecting Ethereum node client
 */
const Select = ({ onChange }: SelectProps) => {
  return (
    <>
      <ReactSelect
        onChange={onChange}
        hideSelectedOptions
        defaultValue={options[0]}
        options={options}
        isSearchable={false}
        components={{
          IndicatorsContainer: () => (
            <div style={{ marginRight: 5 }}>
              <PopupIcon />
            </div>
          ),
        }}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'inherit',
            borderColor: vars.color.border,
            boxShadow: 'none',
            ':hover': {
              borderColor: vars.color.border15,
              boxShadow: 'none',
              color: vars.color.font50,
            },
            minHeight: 28,
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: vars.color.background,
            marginTop: 0,
            borderTop: 0,
            boxShadow: '0px 14px 16px rgba(0, 0, 0, 0.14)',
          }),
          option: (base) => ({
            ...base,
            backgroundColor: 'inherit',
            ':hover': {
              backgroundColor: vars.color.background96,
            },
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
          singleValue: (base) => ({
            ...base,
            color: 'inherit',
            marginLeft: 8,
          }),
        }}
      />
    </>
  );
};
export default Select;
