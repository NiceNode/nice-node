import { ICONS, IconId } from '../../assets/images/icons';

export interface IconProps {
  /**
   * What icon do we want to display?
   */
  iconId: IconId;
}

/**
 * Primary UI component for user interaction
 */
export const Icon = ({ iconId }: IconProps) => {
  return <>{ICONS[iconId]}</>;
};
