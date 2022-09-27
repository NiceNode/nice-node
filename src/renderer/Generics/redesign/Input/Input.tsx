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
}

const Input = ({ placeholder, required, disabled }: InputProps) => {
  return (
    <input
      {...{
        type: 'text',
        className: [container].join(' '),
        placeholder,
        ...(disabled && { disabled }),
        ...(required && { required }),
      }}
    />
  );
};
export default Input;
