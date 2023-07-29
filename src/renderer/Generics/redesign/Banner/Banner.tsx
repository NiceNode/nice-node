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
  offline?: boolean;
  /**
   * Is update available?
   */
  updateAvailable?: boolean;
  /**
   * Is podman not running?
   */
  podmanStopped?: boolean;
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Banner = ({
  offline,
  updateAvailable,
  podmanStopped,
  onClick,
}: BannerProps) => {
  let iconId: IconId = 'blank';
  let title = '';
  let description = '';
  let internalOnClick = () => {};
  if (offline) {
    iconId = 'boltstrike';
    title = 'Currently offline';
    description = 'Please reconnect to the internet';
  } else if (updateAvailable) {
    iconId = 'download1';
    title = 'Update available';
    description = 'New version ready to install';
    internalOnClick = () => {
      console.log('update nice node!');
    };
  } else if (podmanStopped) {
    iconId = 'play';
    title = 'Podman is not running';
    description = 'Click to start Podman';
    internalOnClick = () => {
      console.log('Start Podman!');
    };
  }
  const onClickBanner = () => {
    internalOnClick();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      style={onClick ? { cursor: 'pointer' } : {}}
      className={container}
      onClick={onClickBanner}
      onKeyDown={onClickBanner}
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
