import { useTranslation } from 'react-i18next';
import walletPng from '../../../assets/images/artwork/wallet.png';
import {
  buttonContainer,
  container,
  description,
  title,
} from './walletPrompt.css';

import Button from '../Button/Button';

export interface WalletPromptProps {
  onDismissClick: () => void;
  onSetupClick: () => void;
}

export const WalletPrompt = ({
  onDismissClick,
  onSetupClick,
}: WalletPromptProps) => {
  const { t: g } = useTranslation('genericComponents');
  return (
    <div
      className={container} // webpack and vanilla css config was clashing for image imports so it is here
      style={{
        backgroundImage: `url(${walletPng})`,
      }}
    >
      <div className={title}>{g('WalletPromptTitle')}</div>
      <div className={description}>{g('WalletPromptDescription')}</div>
      <div className={buttonContainer}>
        <Button type="primary" label={g('SetUp')} onClick={onSetupClick} />
        <Button label={g('SkipForNow')} onClick={onDismissClick} />
      </div>
    </div>
  );
};
