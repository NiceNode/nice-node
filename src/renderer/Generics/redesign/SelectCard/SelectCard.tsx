import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NodeIconId } from '../../../assets/images/nodeIcons';
import { Label } from '../Label/Label';
import NodeIcon from '../NodeIcon/NodeIcon';
import {
  activeContainer,
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
   * Icon URL
   */
  iconUrl?: string;
  /**
   * Which icon? (deprecating)
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
  iconUrl,
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
      // biome-ignore lint: useSemanticElements
      role="button"
      tabIndex={0}
    >
      <div className={containerStyles.join(' ')}>
        <NodeIcon iconId={iconId} size="medium" iconUrl={iconUrl} />
        <div className={textContainer}>
          {/* TODO: Fix height to 60px */}
          <div className={titleStyle}>{title}</div>
          <div className={descriptionStyle}>{info}</div>
        </div>
        {releaseLabel && (
          <div className={tagStyle}>
            <Label bold={false} type="orange2" label={releaseLabel} />{' '}
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
