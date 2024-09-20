import { useState } from 'react';
import type { IconId } from '../../../assets/images/icons';
import { Icon } from '../Icon/Icon';
import { container } from './headerButton.css';

export interface HeaderButtonProps {
  /**
   * Type?
   */
  type: string;
  /**
   * onClick
   */
  onClick: () => void;
  toggled?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const HeaderButton = ({
  onClick,
  type,
  toggled: propToggled,
}: HeaderButtonProps) => {
  const [isToggled, setToggled] = useState(Boolean(propToggled));
  let iconId: IconId = 'blank';
  switch (type) {
    case 'close':
      iconId = type;
      break;
    case 'left':
    case 'filter':
    case 'down':
      if (type === 'filter' && isToggled) {
        iconId = 'filterlargefilled';
      } else {
        iconId = `${type}large`;
      }
      break;
    default:
      break;
  }

  const handleButtonClick = () => {
    // If type is filter, toggle the state
    if (type === 'filter') {
      setToggled(!isToggled);
    }
    // Call the original onClick handler
    onClick();
  };

  return (
    <div
      className={[container, isToggled ? 'toggled' : ''].join(' ')}
      onKeyDown={handleButtonClick}
      // biome-ignore lint: useSemanticElements
      role="button"
      tabIndex={0}
      onClick={handleButtonClick}
    >
      <Icon iconId={iconId} />
    </div>
  );
};
