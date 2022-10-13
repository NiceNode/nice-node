import {
  container,
  title,
  description,
  buttonContainer,
  backgroundIcon,
} from './walletPrompt.css';

import Button from '../Button/Button';
import { Icon } from '../Icon/Icon';

export interface WalletPromptProps {
  onClick: () => void;
}

export const WalletPrompt = ({ onClick }: WalletPromptProps) => {
  return (
    <div className={container}>
      <div className={title}>
        Point your browser wallet to your local Ethereum node
      </div>
      <div className={description}>
        Now that your node is fully synced you can use it to lorem ipsum dolor
        sit amet, consectetur adipiscing elit. Nunc eget mi vitae augue iaculis
        tempor eget vitae.
      </div>
      <div className={buttonContainer}>
        <Button primary label="Set up" />
        <Button label="Skip for now" />
      </div>
      <div className={backgroundIcon}>
        <Icon iconId="lightning" />
      </div>
    </div>
  );
};
