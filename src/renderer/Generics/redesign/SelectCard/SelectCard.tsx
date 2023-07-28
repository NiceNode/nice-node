/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { useTranslation } from 'react-i18next';
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
   * Is this a beta client?
   */
  beta?: boolean;
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
  beta = false,
  isSelected = false,
}: SelectCardProps) => {
  const { t } = useTranslation('genericComponents');
  const [selected, setSelected] = useState(isSelected);

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
  return (
    <div
      className={activeContainer}
      onClick={onClickAction}
      onBlur={() => {
        setSelected(false);
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
        {beta && (
          <div className={tagStyle}>
            <Label bold={false} type="pink2" label={t('Beta')} />{' '}
          </div>
        )}
        {minority && (
          <div className={tagStyle}>
            <Label bold={false} type="pink2" label={t('MinorityClient')} />{' '}
          </div>
        )}
      </div>
    </div>
  );
};
export default SelectCard;
