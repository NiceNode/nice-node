import { IconId } from 'renderer/assets/images/icons';
import { Icon } from '../Icon/Icon';
import { container, textContainer, offline, reconnect } from './banner.css';

/**
 * Primary UI component for user interaction
 */
export const Banner = () => {
  return (
    <div className={container}>
      <Icon iconId="boltstrike" />
      <div className={textContainer}>
        <div className={offline}>Currently offline</div>
        <div className={reconnect}>Please reconnect to the internet</div>
      </div>
    </div>
  );
};
