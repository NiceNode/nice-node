import { NodeIcon } from './NodeIcon';
import { RadioButtonBackground } from './RadioButtonBackground';

export interface SelectCardProps {
  /**
   * Node title
   */
  title: string;
  /**
   * Node info
   */
  info?: string;
  /**
   * Which icon? // TODO: Change this to drop down eventually
   */
  iconId: 'ethereum' | 'ethereumValidator' | 'arbitrum';
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const SelectCard = ({
  onClick,
  title,
  info,
  iconId,
  darkMode,
}: SelectCardProps) => {
  return (
    <div className="storybook-select-card">
      <RadioButtonBackground darkMode={darkMode}>
        <div className={['storybook-select-card-contents'].join(' ')}>
          <NodeIcon iconId={iconId} size="medium" />
          <div className="storybook-select-card-container">
            {/* TODO: Fix height to 60px, fix width when tag doesn't exist */}
            <div className="storybook-select-card-title">{title}</div>
            <div className="storybook-select-card-info">{info}</div>
          </div>
          {/* TODO: Add Tag and dropdown options */}
        </div>
      </RadioButtonBackground>
    </div>
  );
};
