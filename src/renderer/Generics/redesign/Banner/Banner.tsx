import { IconId } from 'renderer/assets/images/icons';
import { Icon } from '../Icon/Icon';
import {
  container,
  textContainer,
  titleStyle,
  descriptionStyle,
} from './banner.css';

export interface BannerProps {
  /**
   * Which type?
   */
  type?: 'offline' | 'update';
}

/**
 * Primary UI component for user interaction
 */
export const Banner = ({ type }: BannerProps) => {
  let iconId: IconId = 'blank';
  let title = '';
  let description = '';
  if (type === 'offline') {
    iconId = 'boltstrike';
    title = 'Currently offline';
    description = 'Please reconnect to the internet';
  } else if (type === 'update') {
    iconId = 'download1';
    title = 'Update available';
    description = 'New version ready to install';
  }
  return (
    <div className={container}>
      <Icon iconId={iconId} />
      <div className={textContainer}>
        <div className={titleStyle}>{title}</div>
        <div className={descriptionStyle}>{description}</div>
      </div>
    </div>
  );
};
