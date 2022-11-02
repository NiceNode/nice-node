import {
  NODE_ICONS,
  NodeIconId,
  NODE_COLORS,
} from '../../../assets/images/nodeIcons';
import {
  imageStyle,
  iconBackground,
  largeStyle,
  mediumStyle,
  hasStatusStyle,
  smallStyle,
  statusStyle,
  containerStyle,
  sync,
  red,
  green,
  yellow,
  stopped,
  updating,
} from './nodeIcon.css';
import { Icon } from '../Icon/Icon';

export interface NodeIconProps {
  /**
   * Which icon?
   */
  iconId: NodeIconId;
  /**
   * What's the status?
   */
  status?: 'healthy' | 'warning' | 'error' | 'sync' | 'stopped' | 'updating';
  /**
   * What size should the icon be?
   */
  size: 'small' | 'medium' | 'large';
}

/**
 * Primary UI component for user interaction
 */
export const NodeIcon = ({ iconId, status, size }: NodeIconProps) => {
  let sizeStyle = mediumStyle;
  if (size === 'small') {
    sizeStyle = smallStyle;
  } else if (size === 'large') {
    sizeStyle = largeStyle;
  }
  let statusColorStyle;
  if (status === 'healthy') {
    statusColorStyle = green;
  } else if (status === 'warning') {
    statusColorStyle = yellow;
  } else if (status === 'error') {
    statusColorStyle = red;
  } else if (status === 'sync') {
    statusColorStyle = sync;
  } else if (status === 'stopped') {
    statusColorStyle = stopped;
  } else if (status === 'updating') {
    statusColorStyle = updating;
  }
  let isStatusStyle;
  let statusComponent = null;
  if (status) {
    isStatusStyle = hasStatusStyle;
    if (status === 'sync' || status === 'updating') {
      const icon = status === 'updating' ? 'updatingsmall' : 'sync';
      statusComponent = (
        <div className={[statusStyle, sizeStyle, statusColorStyle].join(' ')}>
          <Icon iconId={icon} />
        </div>
      );
    } else {
      statusComponent = (
        <div className={[statusStyle, sizeStyle, statusColorStyle].join(' ')} />
      );
    }
  }

  return (
    <div className={[containerStyle, sizeStyle].join(' ')}>
      {statusComponent}
      <div
        className={[iconBackground, sizeStyle, isStatusStyle].join(' ')}
        style={{ backgroundColor: NODE_COLORS[iconId] }}
      >
        <img src={NODE_ICONS[iconId]} alt="Node icon" className={imageStyle} />
      </div>
    </div>
  );
};
