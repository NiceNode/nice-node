import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { NodeIcon } from './NodeIcon';
import { RadioButtonBackground } from './RadioButtonBackground';
import { Tag } from './Tag';

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
  iconId: NodeIconId;
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * Is this a major or minority client?
   */
  type?: 'major' | 'minority';
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
  type,
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
          {type && (
            // Use CSS to hide/show dropdown depending on hover
            <div className="storybook-select-card-type">
              <Tag type="pink" label="Minority Client" />
            </div>
          )}
          {/* TODO: Add Tag and dropdown options */}
        </div>
      </RadioButtonBackground>
    </div>
  );
};
