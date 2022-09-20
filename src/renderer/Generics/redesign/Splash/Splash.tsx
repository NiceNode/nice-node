import { container, titleFont, descriptionFont, iconClass } from './splash.css';
import icon from '../../../../../assets/icon.png';
import { Button } from '../Button';

export interface SplashProps {
  title: string;
  description: string;
}

const Splash = ({ title, description }: SplashProps) => {
  return (
    <div className={container}>
      <img className={iconClass} alt="NiceNode logo" src={icon} />
      <div className={titleFont}>{title}</div>
      <div className={descriptionFont}>{description}</div>
      <Button label="Get started" onClick={() => console.log('Get started')} />
    </div>
  );
};
export default Splash;
