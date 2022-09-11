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
}

/**
 * Primary UI component for user interaction
 */
export const InputField = ({
  type,
  iconId,
  placeholder,
  required,
}: InputFieldProps) => {
  // const isRequired = required ? 'required' : '';
  return (
    <div className={['storybook-input-field', `${required}`].join(' ')}>
      <input
        type="text"
        className="storybook-input-field-input"
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby={placeholder}
      />
      <span className="icon-inside">
        <i className="fas fa-map-marker-alt" />
      </span>
    </div>
  );
};
