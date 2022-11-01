import {
  container,
  contentContainer,
  titleFont,
  descriptionFont,
  iconClass,
} from './splash.css';
import niceNodeIcon from '../../../assets/images/logo/mono.svg';
import Button from '../Button/Button';
import welcome from '../../../assets/images/artwork/welcome.png';

/**
 * icon: ImgHTMLAttributes<HTMLImageElement>.src?: string | undefined
 *  can be an svg string, or http url
 */
export interface SplashProps {
  icon?: string;
  title: string;
  description: string;
  onClickGetStarted?: () => void;
}

const Splash = ({
  title,
  description,
  icon,
  onClickGetStarted,
}: SplashProps) => {
  return (
    <div
      className={container}
      style={{
        backgroundImage: `url(${welcome})`,
      }}
    >
      <div className={contentContainer}>
        <img className={iconClass} alt="App logo" src={icon ?? niceNodeIcon} />
        <div className={titleFont}>{title}</div>
        <div className={descriptionFont}>{description}</div>
        <Button label="Get started" primary onClick={onClickGetStarted} />
      </div>
      {/* <img
        className={backgroundImageContainer}
        src={welcome}
        alt="abstract art"
      /> */}
    </div>
  );
};
export default Splash;
