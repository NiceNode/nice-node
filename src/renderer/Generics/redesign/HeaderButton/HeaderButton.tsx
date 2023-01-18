import { IconId } from '../../../assets/images/icons';
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
}

/**
 * Primary UI component for user interaction
 */
export const HeaderButton = ({ onClick, type }: HeaderButtonProps) => {
  let iconId: IconId = 'blank';
  switch (type) {
    case 'close':
      iconId = type;
      break;
    case 'left':
    case 'filter':
    case 'down':
      iconId = `${type}large`;
      break;
    default:
      break;
  }

  return (
    <div
      className={container}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <Icon iconId={iconId} />
    </div>
  );
};
