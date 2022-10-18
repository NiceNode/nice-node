import {
  container,
  title,
  description,
  buttonContainer,
} from './walletPrompt.css';

import Button from '../Button/Button';
import { Icon } from '../Icon/Icon';

export interface WalletPromptProps {
  onDismissClick: () => void;
  onSetupClick: () => void;
}

export const WalletPrompt = ({
  onDismissClick,
  onSetupClick,
}: WalletPromptProps) => {
  const walletImage = require('../../../assets/images/artwork/wallet.png');
  return (
    <div
      className={container}
      style={{
        backgroundImage: `url(${walletImage})`,
        backgroundRepeat: 'none',
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
        <Button primary label="Set up" onClick={onSetupClick} />
        <Button label="Skip for now" onClick={onDismissClick} />
      </div>
    </div>
  );
};
