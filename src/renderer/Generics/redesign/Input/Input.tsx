import { ChangeEvent } from 'react';
import { IconId } from 'renderer/assets/images/icons';
import { Icon } from '../Icon/Icon';
import {
  container,
  inputContainer,
  leftIconContainer,
  rightIconContainer,
} from './input.css';

export interface InputProps {
  /**
   *  Is there a left icon?
   */
  leftIconId?: IconId;
  /**
   *  Is there a right icon?
   */
  rightIconId?: IconId;
  /**
   *  Is there a left icon?
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
  leftIconId,
  rightIconId,
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
  const leftIconStyle = leftIconId ? 'leftIcon' : '';
  const rightIconStyle = rightIconId ? 'rightIcon' : '';
  return (
    <div className={container}>
      {leftIconId && (
        <div className={leftIconContainer}>
          <Icon iconId={leftIconId} />
        </div>
      )}
      <input
        {...{
          type: 'text',
          className: [inputContainer, leftIconStyle, rightIconStyle].join(' '),
          placeholder,
          value,
          ...(disabled && { disabled }),
          ...(required && { required }),
          onChange: (evt) => {
            onChangeAction(evt);
          },
        }}
      />
      {rightIconId && (
        <div className={rightIconContainer}>
          <Icon iconId={rightIconId} />
        </div>
      )}
    </div>
  );
};
export default Input;
