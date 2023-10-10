/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import { Label } from '../Label/Label';
import {
  container,
  activeContainer,
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
   * Which icon?
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
   * Is this an alpha or beta client?
   */
  releasePhase?: string;
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
  releasePhase,
  isSelected = false,
}: SelectCardProps) => {
  const { t: g } = useTranslation('genericComponents');
  const [selected, setSelected] = useState<boolean>();

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected, setSelected]);

  const onClickAction = () => {
    setSelected(true);
    if (onClick) {
      onClick();
    }
  };

  const containerStyles = [container];
  if (selected) {
    containerStyles.push(selectedContainer);
  }
  let releaseLabel = releasePhase;
  if (releasePhase === 'beta') {
    releaseLabel = g('Beta');
  } else if (releasePhase === 'alpha') {
    releaseLabel = g('Alpha');
  }

  return (
    <div
      className={activeContainer}
      onClick={onClickAction}
      onBlur={() => {
        // setSelected(false);
      }}
      onKeyDown={onClickAction}
      role="button"
      tabIndex={0}
    >
      <div className={containerStyles.join(' ')}>
        <NodeIcon iconId={iconId} size="medium" />
        <div className={textContainer}>
          {/* TODO: Fix height to 60px */}
          <div className={titleStyle}>{title}</div>
          <div className={descriptionStyle}>{info}</div>
        </div>
        {releaseLabel && (
          <div className={tagStyle}>
            <Label bold={false} type="pink2" label={releaseLabel} />{' '}
          </div>
        )}
        {minority && (
          <div className={tagStyle}>
            <Label bold={false} type="pink2" label={g('MinorityClient')} />{' '}
          </div>
        )}
      </div>
    </div>
  );
};
export default SelectCard;
