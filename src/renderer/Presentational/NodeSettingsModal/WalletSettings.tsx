import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  WalletBackgroundId,
  WALLET_BACKGROUNDS,
} from '../../assets/images/wallets';
import {
  walletDescription,
  walletsTitle,
  walletContainer,
  walletTitle,
  walletImage,
} from './WalletSettings.css';
import LineLabelSettings from '../../Generics/redesign/LabelSetting/LabelSettings';
import { Toggle } from '../../Generics/redesign/Toggle/Toggle';
import DropdownLink from '../../Generics/redesign/Link/DropdownLink';

export const WalletSettings = () => {
  const { t: tGeneric } = useTranslation('genericComponents');
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>();

  const wallets = [
    {
      walletId: 'metamask',
      walletName: 'Metamask',
    },
    {
      walletId: 'coinbase',
      walletName: 'Coinbase',
    },
    {
      walletId: 'brave',
      walletName: 'Brave',
    },
    {
      walletId: 'tally',
      walletName: 'TallyHo!',
    },
    {
      walletId: 'argent',
      walletName: 'Argent',
    },
  ];

  type WalletProps = {
    walletId: WalletBackgroundId;
    walletName: string;
  };

  const getWalletItem = ({ walletId, walletName }: WalletProps) => {
    return {
      label: (
        <div className={walletContainer}>
          <div
            className={walletImage}
            style={{
              backgroundImage: `url(${WALLET_BACKGROUNDS[walletId]})`,
            }}
          />
          <div className={walletTitle}>{walletName}</div>
        </div>
      ),
      value: (
        <Toggle
          // checked={isOpenOnStartup}
          onChange={(newValue) => {
            console.log(newValue);
          }}
        />
      ),
    };
  };
  return (
    <>
      <div className={walletDescription}>
        Hook up your browser wallet to this node so you can enjoy greater
        security, privacy, and read speeds. Enable your favourite browser
        wallets below to allow access to your node. Don’t forget to add a new
        network in your wallet with the configuration below.
      </div>
      <div className={walletsTitle}>Wallets</div>
      <LineLabelSettings
        items={[
          {
            sectionTitle: '',
            items: wallets.map((wallet: WalletProps) => {
              return getWalletItem(wallet);
            }),
          },
        ]}
      />
      <DropdownLink
        text={`${
          isOptionsOpen ? tGeneric('Hide') : tGeneric('Show')
        } ${tGeneric('advancedOptions')}`}
        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
        isDown={!isOptionsOpen}
      />
      {isOptionsOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <span style={{ fontWeight: 600 }}>{tGeneric('Network')}</span>

          <div
            style={{
              width: 300,
              display: 'inline-block',
              marginLeft: 'auto',
            }}
          />
        </div>
      )}
    </>
  );
};
