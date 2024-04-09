import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { IconId } from '../../../assets/images/icons';
import { Icon } from '../Icon/Icon';
import {
  container,
  descriptionStyle,
  innerContainer,
  textContainer,
  titleStyle,
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
  /**
   * Is podman installed
   */
  podmanInstalled?: boolean;
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Banner = ({
  offline,
  updateAvailable,
  podmanStopped,
  podmanInstalled,
  onClick,
}: BannerProps) => {
  // Use useState to manage description dynamically
  const [description, setDescription] = useState<string>('');
  const [iconId, setIconId] = useState<IconId>('blank');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const { t: g } = useTranslation('genericComponents');

  useEffect(() => {
    if (offline) {
      setIconId('boltstrike');
      setTitle(g('CurrentlyOffline'));
      setDescription(g('PleaseReconnect'));
    } else if (!podmanInstalled) {
      setIconId('warningcircle');
      setTitle(g('PodmanIsNotInstalled'));
      setDescription(g('ClickToInstallPodman'));
    } else if (updateAvailable) {
      setIconId('download1');
      setTitle(g('UpdateAvailable'));
      setDescription(g('NewVersionAvailable'));
    } else if (podmanStopped) {
      setIconId('play');
      setTitle(g('PodmanIsNotRunning'));
      setDescription(g('ClickToStartPodman'));
    }
  }, [offline, updateAvailable, podmanStopped, podmanInstalled, g]);

  const onClickBanner = () => {
    if (isClicked || offline) {
      return;
    }

    setIsClicked(true);

    if (!podmanInstalled) {
      setDescription(g('PodmanInstalling'));
      setLoading(true);
    } else if (podmanStopped) {
      setDescription(g('PodmanLoading'));
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
