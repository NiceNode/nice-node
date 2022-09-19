import { Bubble } from './Bubble';
import { Icon } from './Icon';

export interface SidebarLinkItemProps {
  /**
   * Button contents
   */
  label: string;
  /**
   * Button contents
   */
  count?: number;
  /**
   * Which icon? // TODO: Change this to drop down eventually
   */
  iconId?: 'bell' | 'add' | 'preferences';
  /**
   * Is this dark mode?
   */
  darkMode?: boolean;
  /**
   * Optional click handler
   */
  // onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const SidebarLinkItem = ({
  darkMode,
  label,
  count,
  iconId = 'bell',
}: SidebarLinkItemProps) => {
  const darkStyle = darkMode ? 'darkMode' : '';
  return (
    <div className={['storybook-sidebar-link-item', `${darkStyle}`].join(' ')}>
      <Icon iconId={iconId} />
      <div className="storybook-sidebar-link-item-label">{label}</div>
      {count && (
        <div className="storybook-sidebar-link-item-bubble">
          <Bubble count={count} />
        </div>
      )}
    </div>
  );
};
