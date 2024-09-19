import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NODE_COLORS,
  NODE_ICONS,
  type NodeIconId,
} from '../../../assets/images/nodeIcons';
import { Icon } from '../Icon/Icon';
import {
  containerStyle,
  green,
  hasStatusStyle,
  iconBackground,
  imageStyle,
  largeStyle,
  mediumStyle,
  red,
  smallStyle,
  statusStyle,
  stopped,
  sync,
  updating,
  yellow,
} from './nodeIcon.css';

export interface NodeIconProps {
  /**
   * Which icon?
   */
  iconId: NodeIconId | string;
  /**
   * What's the status?
   */
  status?: 'online' | 'warning' | 'error' | 'sync' | 'stopped' | 'updating';
  /**
   * What size should the icon be?
   */
  size: 'small' | 'medium' | 'large';
  /**
   * (optional) Use a URL for an icon instead of a hard-coded, bundled image icon
   */
  iconUrl?: string;
}

/**
 * Primary UI component for user interaction
 */
const NodeIcon = ({ iconId, status, size, iconUrl }: NodeIconProps) => {
  const { t: g } = useTranslation('genericComponents');

  let sizeStyle = mediumStyle;
  if (size === 'small') {
    sizeStyle = smallStyle;
  } else if (size === 'large') {
    sizeStyle = largeStyle;
  }
  let statusColorStyle;
  if (status === 'online') {
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
      {/* https://stackoverflow.com/questions/6040005/relatively-position-an-element-without-it-taking-up-space-in-document-flow */}
      <div style={{ position: 'relative', width: 0, height: 0 }}>
        {statusComponent}
      </div>
      <div
        className={[iconBackground, sizeStyle, isStatusStyle].join(' ')}
        style={{ backgroundColor: NODE_COLORS[iconId as NodeIconId] }}
      >
        <img
          src={
            // Just iconUrl isn't backwards compatible, but will be used now
            NODE_ICONS[iconId as NodeIconId] || iconUrl || undefined
          }
          alt={g('NodeIcon')}
          className={imageStyle}
        />
      </div>
    </div>
  );
};

export default memo(NodeIcon);
