import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  useEffect(() => {
    if (offline) {
      setIconId('boltstrike');
      setTitle(t('CurrentlyOffline'));
      setDescription(t('PleaseReconnect'));
    } else if (!podmanInstalled) {
      setIconId('warningcircle');
      setTitle(t('PodmanIsNotInstalled'));
      setDescription(t('ClickToInstallPodman'));
    } else if (updateAvailable) {
      setIconId('download1');
      setTitle(t('UpdateAvailable'));
      setDescription(t('NewVersionAvailable'));
    } else if (podmanStopped) {
      setIconId('play');
      setTitle(t('PodmanIsNotRunning'));
      setDescription(t('ClickToStartPodman'));
    }
  }, [offline, updateAvailable, podmanStopped, podmanInstalled, t]);

  const onClickBanner = () => {
    if (isClicked) {
      return;
    }

    setIsClicked(true);

    if (!podmanInstalled) {
      setDescription(t('PodmanInstalling'));
      setLoading(true);
    } else if (podmanStopped) {
      setDescription(t('PodmanLoading'));
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
