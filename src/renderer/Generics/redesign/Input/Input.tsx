import { ChangeEvent } from 'react';
import { container } from './input.css';

export interface InputProps {
  /**
   *  Control the input by passing a value
   */
  value?: string;
  /**
   *  What's the placeholder text?
   */
  placeholder?: string;
  /**
   *  Is this input field required?
   */
  required?: boolean;
  /**
   *  Is this input field disabled?
   */
  disabled?: boolean;
  onChange?: (newValue: string) => void;
}

const Input = ({
  value,
  placeholder,
  required,
  disabled,
  onChange = () => {},
}: InputProps) => {
  const onChangeAction = (evt: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(evt.target.value);
    }
  };
  return (
    <input
      {...{
        type: 'text',
        className: [container].join(' '),
        placeholder,
        value,
        ...(disabled && { disabled }),
        ...(required && { required }),
        onChange: (evt) => {
          onChangeAction(evt);
        },
      }}
    />
  );
};
export default Input;
