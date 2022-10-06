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
  error,
  healthy,
  warning,
} from './nodeIcon.css';
import { Icon } from '../Icon';

export interface NodeIconProps {
  /**
   * Which icon? // TODO: Change this to drop down eventually
   */
  iconId: NodeIconId;
  /**
   * What's the status?
   */
  status?: 'healthy' | 'warning' | 'error' | 'sync';
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
    statusColorStyle = healthy;
  } else if (status === 'warning') {
    statusColorStyle = warning;
  } else if (status === 'error') {
    statusColorStyle = error;
  } else if (status === 'sync') {
    statusColorStyle = sync;
  }
  let isStatusStyle;
  let statusComponent = null;
  if (status) {
    isStatusStyle = hasStatusStyle;
    if (status === 'sync') {
      statusComponent = (
        <div className={[statusStyle, sizeStyle, statusColorStyle].join(' ')}>
          <Icon iconId="sync" />
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
