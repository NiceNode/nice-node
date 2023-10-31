import { useTranslation, Trans } from 'react-i18next';
import {
  container,
  contentContainer,
  titleFont,
  descriptionFont,
  iconClass,
  termsContainer,
  termsText,
} from './splash.css';
import niceNodeIcon from '../../../assets/images/logo/mono.svg';
import Button from '../Button/Button';
import welcome from '../../../assets/images/artwork/welcome.png';
import Linking from '../Link/Linking';

/**
 * icon: ImgHTMLAttributes<HTMLImageElement>.src?: string | undefined
 *  can be an svg string, or http url
 */
export interface SplashProps {
  onClickGetStarted?: () => void;
}

const Splash = ({ onClickGetStarted }: SplashProps) => {
  const { t } = useTranslation();
  const { t: g } = useTranslation('genericComponents');

  return (
    <div
      className={container}
      // webpack and vanilla css config was clashing for image imports so it is here
      style={{
        backgroundImage: `url(${welcome})`,
      }}
    >
      <div className={contentContainer}>
        <img className={iconClass} alt="App logo" src={niceNodeIcon} />
        <div className={titleFont}>{t('WelcomeToNiceNode')}</div>
        <div className={descriptionFont}>
          {t('WelcomeToNiceNodeDescription')}
        </div>
        <div className={termsContainer}>
          <div className={termsText}>
            <Trans
              i18nKey="genericComponents:TermsAgreement"
              components={[
                <Linking
                  url="http://nicenode.xyz/terms.html"
                  text="Terms of Use"
                  inline
                  hideIcon
                  small
                  underline={false}
                />,
                <Linking
                  url="http://nicenode.xyz/privacy.html"
                  text="Privacy Statement"
                  inline
                  hideIcon
                  small
                />,
              ]}
            />
          </div>
        </div>
        <Button
          label={g('GetStarted')}
          type="primary"
          onClick={onClickGetStarted}
        />
      </div>
    </div>
  );
};
export default Splash;
