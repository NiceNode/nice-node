import { useTranslation } from 'react-i18next';

import Splash from '../../Generics/redesign/Splash/Splash';
import icon from '../../assets/images/logo/mono.svg';

const NNSplash = ({
  onClickGetStarted,
}: {
  onClickGetStarted?: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Splash
      icon={icon}
      title={t('WelcomeToNiceNode')}
      description={t('WelcomeToNiceNodeDescription')}
      onClickGetStarted={onClickGetStarted}
    />
  );
};
export default NNSplash;
