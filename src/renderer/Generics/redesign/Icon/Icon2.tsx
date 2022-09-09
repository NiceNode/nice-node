import { ICONS, IconId } from '../../../assets/images/icons';
import { container } from './icon.css.ts';

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
export const Icon = ({ iconId, variant = 'icon' }: IconProps) => {
  return (
    <div
      style={{
        background: `url(${ICONS[iconId]})`,
        // maskImage: `url(${ICONS[iconId]})`,
      }}
      className={container}
    />
  );
};
