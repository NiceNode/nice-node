import {
  container,
  contentContainer,
  titleFont,
  descriptionFont,
  iconClass,
} from './splash.css';
import icon from '../../../../../assets/icon.png';
import Button from '../Button/Button';

export interface SplashProps {
  title: string;
  description: string;
}

const Splash = ({ title, description }: SplashProps) => {
  const welcomeImage = require('../../../assets/images/artwork/welcome.png');
  return (
    <div
      style={{ backgroundImage: `url(${welcomeImage})` }}
      className={container}
    >
      <div className={contentContainer}>
        <img className={iconClass} alt="NiceNode logo" src={icon} />
        <div className={titleFont}>{title}</div>
        <div className={descriptionFont}>{description}</div>
        <Button
          label="Get started"
          primary
          onClick={() => console.log('Get started')}
        />
      </div>
    </div>
  );
};
export default Splash;
