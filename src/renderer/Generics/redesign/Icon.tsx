import { ICONS, IconId } from '../../assets/images/icons';

export interface IconProps {
  /**
   * What icon do we want to display?
   */
  iconId: IconId;
  /**
   * Text only, with icon, or just icon?
   */
  variant?: 'text' | 'icon-left' | 'icon-right' | 'icon';
}

/**
 * Primary UI component for user interaction
 */
export const Icon = ({ iconId, variant }: IconProps) => {
  // TODO: Add dark mode here so we don't have to create CSS for each component
  const variantStyle = variant || '';
  return (
    <i
      style={{
        WebkitMaskImage: `url(${ICONS[iconId]})`,
        maskImage: `url(${ICONS[iconId]})`,
      }}
      className={['storybook-button-icon', `${variantStyle}`].join(' ')}
    />
  );
};
