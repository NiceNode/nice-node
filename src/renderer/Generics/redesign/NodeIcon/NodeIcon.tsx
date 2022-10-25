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
  status?: 'healthy' | 'warning' | 'error' | 'sync' | 'stopped';
  /**
   * What size should the icon be?
   */
  size: 'small' | 'medium' | 'large';
  /**
   * Is it animated?
   */
  animate?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const NodeIcon = ({ iconId, status, size, animate }: NodeIconProps) => {
  const isAnimated = animate ? 'animate' : '';
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
  }
  let isStatusStyle;
  let statusComponent = null;
  if (status) {
    isStatusStyle = hasStatusStyle;
    if (status === 'sync') {
      statusComponent = (
        <div
          className={[
            statusStyle,
            sizeStyle,
            statusColorStyle,
            isAnimated,
          ].join(' ')}
        >
          <Icon iconId="sync" />
        </div>
      );
    } else {
      statusComponent = (
        <div
          className={[
            statusStyle,
            sizeStyle,
            statusColorStyle,
            isAnimated,
          ].join(' ')}
        />
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
