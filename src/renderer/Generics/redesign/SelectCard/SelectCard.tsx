/* eslint-disable jsx-a11y/click-events-have-key-events */
import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { NodeIcon } from '../NodeIcon';
import { Tag } from '../Tag';
import {
  container,
  descriptionStyle,
  selectedContainer,
  tagStyle,
  textContainer,
  titleStyle,
} from './selectCard.css';

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
   * Is this selected
   */
  isSelected?: boolean;
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
const SelectCard = ({
  onClick,
  title,
  info,
  iconId,
  minority = false,
  isSelected,
}: SelectCardProps) => {
  const containerStyles = [container];
  if (isSelected) {
    containerStyles.push(selectedContainer);
  }
  return (
    <div
      className={containerStyles.join(' ')}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <NodeIcon iconId={iconId} size="medium" />
      <div className={textContainer}>
        {/* TODO: Fix height to 60px */}
        <div className={titleStyle}>{title}</div>
        <div className={descriptionStyle}>{info}</div>
      </div>
      {minority && (
        <div className={tagStyle}>
          <Tag type="pink" label="Minority Client" />{' '}
        </div>
      )}
    </div>
  );
};
export default SelectCard;
