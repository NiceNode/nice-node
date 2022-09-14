import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { Icon } from './Icon';
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
   * Is this a minority client?
   */
  minority?: boolean;
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
  minority = false,
}: SelectCardProps) => {
  // if onClick exists, we want to enable hover states to allow selecting other items
  const selection = onClick ? 'selection' : '';

  const getSelectionComponents = () => {
    const components = [];
    if (minority) {
      components.push(
        <div
          className={['storybook-select-card-type', `${selection}`].join(' ')}
        >
          <Tag type="pink" label="Minority Client" />
        </div>
      );
    }
    if (selection !== '') {
      components.push(
        <>
          <div className="storybook-select-card-selection">
            See alternatives
          </div>
          <div className="storybook-select-card-icon">
            <Icon iconId="popup" />
          </div>
        </>
      );
    }
    return components;
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className={['storybook-select-card'].join(' ')}>
      <RadioButtonBackground darkMode={darkMode} onClick={onClick}>
        <div className={['storybook-select-card-contents'].join(' ')}>
          <NodeIcon iconId={iconId} size="medium" />
          <div className="storybook-select-card-container">
            {/* TODO: Fix height to 60px */}
            <div className="storybook-select-card-title">{title}</div>
            <div className="storybook-select-card-info">{info}</div>
          </div>
          {getSelectionComponents()}
        </div>
      </RadioButtonBackground>
    </div>
  );
};
