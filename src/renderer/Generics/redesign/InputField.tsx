import { IconId } from 'renderer/assets/images/icons';

export interface InputFieldProps {
  /**
   *  What type of input?
   */
  type?: 'icon-left' | 'icon-right';
  /**
   *  Which icon?
   */
  iconId?: IconId;
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

/**
 * Primary UI component for user interaction
 */
export const InputField = ({
  type,
  iconId,
  placeholder,
  required,
  disabled,
}: InputFieldProps) => {
  return (
    <div className={['storybook-input-field'].join(' ')}>
      <input
        {...{
          type: 'text',
          className: 'storybook-input-field-input',
          placeholder,
          ...(disabled && { disabled }),
          ...(required && { required }),
        }}
      />
      <span className="icon-inside">
        <i className="fas fa-map-marker-alt" />
      </span>
    </div>
  );
};
