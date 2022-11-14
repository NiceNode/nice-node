import { ChangeEvent } from 'react';
import { container } from './input.css';

export interface InputProps {
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
  /**
   *  Is there an onChange event when a user types something?
   */
  onChange?: (text: string) => void;
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
        ...(disabled && { disabled }),
        ...(required && { required }),
        onChange: (evt) => {
          onChangeAction(evt);
        },
        value,
      }}
    />
  );
};
export default Input;
