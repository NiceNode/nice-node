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
  onChange,
}: InputProps) => {
  return (
    <input
      {...{
        type: 'text',
        className: [container].join(' '),
        placeholder,
        value,
        onchange: onChange,
        ...(disabled && { disabled }),
        ...(required && { required }),
      }}
    />
  );
};
export default Input;
