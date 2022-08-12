import { ICONS } from '../../assets/icons';

export interface IconProps {
  /**
   * What icon do we want to display?
   */
  iconId: 'bell' | 'add' | 'preferences' | 'settings' | 'play';
  /**
   * Text only, with icon, or just icon?
   */
  variant?: 'text' | 'icon-left' | 'icon-right' | 'icon';
}

/**
 * Primary UI component for user interaction
 */
export const Icon = ({ iconId, variant }: IconProps) => {
  return (
    <i
      style={{
        WebkitMaskImage: `url(${ICONS[iconId]})`,
        maskImage: `url(${ICONS[iconId]})`,
      }}
      className={['storybook-button-icon', `${variant}`].join(' ')}
    />
  );
};
