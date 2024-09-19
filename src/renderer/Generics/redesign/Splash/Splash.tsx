import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from '../../../ThemeManager.js';
import welcomeDm from '../../../assets/images/artwork/welcome-Dm.png';
import welcomeLm from '../../../assets/images/artwork/welcome-Lm.png';
import niceNodeIcon from '../../../assets/images/logo/mono.svg';
import Button from '../Button/Button';
import Linking from '../Link/Linking';
import {
  container,
  contentContainer,
  descriptionFont,
  iconClass,
  termsContainer,
  termsText,
  titleFont,
} from './splash.css';

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
  const { isDarkTheme } = useTheme();
  const welcomeImage = isDarkTheme ? welcomeDm : welcomeLm;

  return (
    <div
      className={container}
      // webpack and vanilla css config was clashing for image imports so it is here
      style={{
        backgroundImage: `url(${welcomeImage})`,
      }}
    >
      <div className={contentContainer}>
        <img className={iconClass} alt="App logo" src={niceNodeIcon} />
        <div id="welcome" className={titleFont}>
          {t('WelcomeToNiceNode')}
        </div>
        <div className={descriptionFont}>
          {t('WelcomeToNiceNodeDescription')}
        </div>
        <div className={termsContainer}>
          <div className={termsText}>
            <Trans
              i18nKey="genericComponents:TermsAgreement"
              components={[
                <Linking
                  key="termsLink"
                  url="http://nicenode.xyz/terms"
                  text={g('Terms')}
                  inline
                  hideIcon
                  small
                  underline={false}
                />,
                <Linking
                  key="privacyLink"
                  url="http://nicenode.xyz/privacy"
                  text={g('Privacy')}
                  inline
                  hideIcon
                  small
                  underline={false}
                />,
              ]}
            />
          </div>
        </div>
        <Button
          id="getStartedBtn"
          label={g('GetStarted')}
          type="primary"
          onClick={onClickGetStarted}
        />
      </div>
    </div>
  );
};
export default Splash;
