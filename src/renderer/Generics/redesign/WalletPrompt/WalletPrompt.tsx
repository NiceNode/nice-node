import {
  container,
  title,
  description,
  buttonContainer,
} from './walletPrompt.css';
import walletPng from '../../../assets/images/artwork/wallet.png';

import Button from '../Button/Button';

export interface WalletPromptProps {
  onDismissClick: () => void;
  onSetupClick: () => void;
}

export const WalletPrompt = ({
  onDismissClick,
  onSetupClick,
}: WalletPromptProps) => {
  return (
    <div
      className={container} // webpack and vanilla css config was clashing for image imports so it is here
      style={{
        backgroundImage: `url(${walletPng})`,
      }}
    >
      <div className={title}>
        Point your browser wallet to your local Ethereum node
      </div>
      <div className={description}>
        Now that your node is fully synced you can use it to lorem ipsum dolor
        sit amet, consectetur adipiscing elit. Nunc eget mi vitae augue iaculis
        tempor eget vitae.
      </div>
      <div className={buttonContainer}>
        <Button type="primary" label="Set up" onClick={onSetupClick} />
        <Button label="Skip for now" onClick={onDismissClick} />
      </div>
    </div>
  );
};
