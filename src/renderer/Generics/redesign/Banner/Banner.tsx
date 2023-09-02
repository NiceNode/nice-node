import { useState, useEffect } from 'react';
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
  // Use useState to manage description dynamically
  const [description, setDescription] = useState<string>('');
  const [iconId, setIconId] = useState<IconId>('blank');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (offline) {
      setIconId('boltstrike');
      setTitle('Currently offline');
      setDescription('Please reconnect to the internet');
    } else if (updateAvailable) {
      setIconId('download1');
      setTitle('Update available');
      setDescription('New version ready to install');
    } else if (podmanStopped) {
      setIconId('play');
      setTitle('Podman is not running');
      setDescription('Click to start Podman');
    }
  }, [offline, updateAvailable, podmanStopped]);

  const onClickBanner = () => {
    if (podmanStopped) {
      console.log('Start Podman!');
      setDescription('Loading...');
      setLoading(true);
    } else if (updateAvailable) {
      console.log('update nice node!');
    }

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
      <div className={[innerContainer, loading ? 'loading' : ''].join(' ')}>
        <Icon iconId={iconId} />
        <div className={textContainer}>
          <div className={titleStyle}>{title}</div>
          <div className={descriptionStyle}>{description}</div>
        </div>
      </div>
    </div>
  );
};
