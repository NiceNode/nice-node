import { Bubble } from './Bubble';
import { Icon } from './Icon';

export interface SidebarNodeItemProps {
  /**
   * Node title
   */
  title: string;
  /**
   * Node info
   */
  info?: number;
  /**
   * Which icon? // TODO: Change this to drop down eventually
   */
  iconId?: 'ethereum' | 'ethereumValidator' | 'arbitrum';
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * What's the status?
   */
  status?: 'healthy' | 'warning' | 'error' | 'sync';
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const SidebarNodeItem = ({
  onClick,
  darkMode,
  title,
  info,
  iconId,
  status,
}: SidebarNodeItemProps) => {
  const darkStyle = darkMode ? 'darkMode' : '';
  return (
    <div className={['storybook-sidebar-link-item', `${darkStyle}`].join(' ')}>
      <Icon iconId={iconId} />
      <div className="storybook-sidebar-link-item-title">{title}</div>
      {info && (
        <div className="storybook-sidebar-link-item-bubble">
          <Bubble info={info} />
        </div>
      )}
    </div>
  );
};
