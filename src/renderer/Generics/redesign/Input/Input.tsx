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
  onChange?: () => void;
}

const Input = ({
  placeholder,
  required,
  disabled,
  onChange = () => {},
}: InputProps) => {
  const onChangeAction = (evt) => {
    if (onChange) {
      onChange(evt);
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
      }}
    />
  );
};
export default Input;
