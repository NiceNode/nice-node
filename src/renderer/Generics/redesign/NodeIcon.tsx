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
}

/**
 * Primary UI component for user interaction
 */
export const NodeIcon = ({ iconId, status, size }: NodeIconProps) => {
  const hasStatus = status ? 'status' : '';
  return (
    <div className={['storybook-node', `${size}`].join(' ')}>
      {status && (
        <i
          style={{
            backgroundImage: `url(${NODE_ICONS[status]})`,
          }}
          className={['storybook-node-status', `${size}`, `${status}`].join(
            ' '
          )}
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
