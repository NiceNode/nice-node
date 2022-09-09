import { NODE_ICONS } from '../../assets/images/nodeIcons';

export interface NodeIconProps {
  /**
   * Which icon? // TODO: Change this to drop down eventually
   */
  iconId: 'ethereum' | 'ethereumValidator' | 'arbitrum';
  /**
   * What's the status?
   */
  status?: 'healthy' | 'warning' | 'error' | 'sync';
  /**
   * What size should the icon be?
   */
  size: 'small' | 'medium' | 'large';
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const NodeIcon = ({ iconId, status, size, darkMode }: NodeIconProps) => {
  const hasStatus = status ? 'status' : '';
  const darkStyle = darkMode ? 'darkMode' : '';
  let imageProps = {};
  if (status === 'sync') {
    imageProps = {
      WebkitMaskImage: `url(${NODE_ICONS[status]})`,
      maskImage: `url(${NODE_ICONS[status]})`,
    };
  } else if (status) {
    imageProps = { backgroundImage: `url(${NODE_ICONS[status]})` };
  }
  return (
    <div className={['storybook-node', `${size}`].join(' ')}>
      {status && (
        <i
          style={imageProps}
          className={[
            'storybook-node-status',
            `${size}`,
            `${status}`,
            `${darkStyle}`,
          ].join(' ')}
        />
      )}
      <div
        className={['storybook-node-icon', hasStatus, `${size}`].join(' ')}
        style={{ backgroundColor: '#6DA3F9' }}
      >
        <i
          style={{
            backgroundImage: `url(${NODE_ICONS[iconId]})`,
          }}
          className={['storybook-node-image', `${size}`].join(' ')}
        />
      </div>
    </div>
  );
};
