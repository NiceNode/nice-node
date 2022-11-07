import { IconId } from 'renderer/assets/images/icons';
import { Icon } from '../Icon/Icon';
import {
  container,
  innerContainer,
  textContainer,
  titleStyle,
  descriptionStyle,
} from './banner.css';

export interface BannerProps {
  /**
   * Is it offline?
   */
  offline: boolean;
  /**
   * Is update available?
   */
  updateAvailable: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Banner = ({ offline, updateAvailable }: BannerProps) => {
  let iconId: IconId = 'blank';
  let title = '';
  let description = '';
  let onClick = () => {};
  if (offline) {
    iconId = 'boltstrike';
    title = 'Currently offline';
    description = 'Please reconnect to the internet';
  } else if (updateAvailable) {
    iconId = 'download1';
    title = 'Update available';
    description = 'New version ready to install';
    onClick = () => {
      console.log('update nice node!');
    };
  }
  return (
    <div
      style={updateAvailable ? { cursor: 'pointer' } : {}}
      className={container}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={innerContainer}>
        <Icon iconId={iconId} />
        <div className={textContainer}>
          <div className={titleStyle}>{title}</div>
          <div className={descriptionStyle}>{description}</div>
        </div>
      </div>
    </div>
  );
};
