import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  placeholder = '',
  required,
  disabled,
  onChange = () => {},
}: InputProps) => {
  const [sValue, setValue] = useState<string>('');
  const { t: g } = useTranslation('genericComponents');

  useEffect(() => {
    setValue(value || '');
  }, [value]);

  const onChangeAction = (evt: ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  const leftIconStyle = leftIconId ? 'leftIcon' : '';
  const rightIconStyle = rightIconId ? 'rightIcon' : '';
  const placeHolderText = required ? g('Required') : placeholder;

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
          placeholder: placeHolderText,
          value: sValue,
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
