import { useTranslation } from 'react-i18next';
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
  getStartedLabel?: string;
  onClickGetStarted?: () => void;
}

const Splash = ({
  title,
  description,
  icon,
  getStartedLabel,
  onClickGetStarted,
}: SplashProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={container}
      // webpack and vanilla css config was clashing for image imports so it is here
      style={{
        backgroundImage: `url(${welcome})`,
      }}
    >
      <div className={contentContainer}>
        <img className={iconClass} alt="App logo" src={icon ?? niceNodeIcon} />
        <div className={titleFont}>{title}</div>
        <div className={descriptionFont}>{description}</div>
        <Button
          label={getStartedLabel ?? t('GetStarted')}
          primary
          onClick={onClickGetStarted}
        />
      </div>
    </div>
  );
};
export default Splash;
