import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import Input from '../../Generics/redesign/Input/Input';
import Button from '../../Generics/redesign/Button/Button';
import { Checkbox } from '../../Generics/redesign/Checkbox/Checkbox';
import { Icon } from '../../Generics/redesign/Icon/Icon';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import {
  WalletBackgroundId,
  WALLET_BACKGROUNDS,
} from '../../assets/images/wallets';
import {
  walletDescription,
  title,
  walletContainer,
  walletTitle,
  walletImage,
  walletDetails,
  advancedOptionsLink,
  advancedOptions,
  advancedOptionsDescription,
  advancedOptionsListContainer,
  advancedOptionsItemContainer,
  networkValue,
  copyIcon,
  inputContainer,
  selectContainer,
  buttonContainer,
  addRow,
} from './WalletSettings.css';
import LineLabelSettings from '../../Generics/redesign/LabelSetting/LabelSettings';
import { Toggle } from '../../Generics/redesign/Toggle/Toggle';
import DropdownLink from '../../Generics/redesign/Link/DropdownLink';
import Select from '../../Generics/redesign/Select/Select';
import Linking from '../../Generics/redesign/Link/Linking';

export const WalletSettings = (props) => {
  const { t: tGeneric } = useTranslation('genericComponents');
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>();

  const { onChange } = props;

  // fetch this from data layer
  const browserSettings = [
    {
      browser: 'chrome',
      extensionId: '',
    },
    {
      browser: 'firefox',
      extensionId: '',
    },
    {
      browser: 'brave',
      extensionId: '',
    },
  ];

  const [browserItems, setBrowserItems] = useState<
    {
      browser: string;
      extensionId: string;
    }[]
  >(browserSettings);

  type WalletProps = {
    walletId: WalletBackgroundId;
    walletName: string;
    walletAddress: string;
  };

  let allowedWallets: string[] = [];

  const wallets = [
    {
      walletId: 'metamask',
      walletName: 'Metamask',
      walletAddress: 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn',
    },
    {
      walletId: 'coinbase',
      walletName: 'Coinbase',
      walletAddress: 'chrome-extension://hnfanknocfeofbddgcijnmhnfnkdnaad',
    },
    {
      walletId: 'brave',
      walletName: 'Brave',
      walletAddress: 'chrome-extension://',
    },
    {
      walletId: 'tally',
      walletName: 'TallyHo!',
      walletAddress: 'chrome-extension://eajafomhmkipbjmfmhebemolkcicgfmd',
    },
    {
      walletId: 'argent',
      walletName: 'Argent',
      walletAddress: 'chrome-extension://dlcobpjiigpikoobohmabehhmhfoodbb/',
    },
  ];

  const networkLabels = {
    networkName: 'Network Name',
    rpcUrl: 'http://localhost:8080',
    chainId: 'Chain ID',
    currencySymbol: 'Currency Symbol',
    blockExplorer: 'Block explorer',
  };

  // fetch this from data layer
  const networkDetails = {
    networkName: 'Ethereum Mainnet (NiceNode)',
    rpcUrl: 'New RPC URL',
    chainId: '1',
    currencySymbol: 'ETH',
    blockExplorer: 'https://etherscan.io',
  };

  const getNetworkItem = (key: string) => {
    return {
      label: networkLabels[key],
      value: (
        <div className={networkValue}>
          <div>{networkDetails[key]}</div>
          <div
            className={copyIcon}
            onClick={() => {
              console.log('copy text!');
            }}
          >
            <Icon iconId="copy" />
          </div>
        </div>
      ),
    };
  };

  const getWalletItem = ({
    walletId,
    walletName,
    walletAddress,
  }: WalletProps) => {
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
          onText="Allowed"
          offText="Disabled"
          onChange={(newValue) => {
            if (newValue) {
              allowedWallets.push(walletAddress);
            } else {
              allowedWallets = allowedWallets.filter(
                (e) => e !== walletAddress
              );
            }
            // onChange('httpCorsDomains', allowedWallets.toString());
            console.log(allowedWallets.toString());
          }}
        />
      ),
    };
  };

  const getBrowserItem = (
    item: { browser: string; extensionId: string },
    index: number
  ) => {
    return (
      <>
        <div className={advancedOptionsItemContainer}>
          <Checkbox checked={item.extensionId !== ''} onClick={() => {}} />
          <div className={selectContainer}>
            <Select
              value={item.browser}
              onChange={console.log}
              options={[
                { value: 'chrome', label: 'Chrome' },
                { value: 'firefox', label: 'Firefox' },
                { value: 'brave', label: 'Brave' },
              ]}
            />
          </div>
          <div className={inputContainer}>
            <Input
              placeholder="Browser extension ID"
              value={item.extensionId}
            />
          </div>
          <div className={buttonContainer}>
            <Button
              ghost
              variant="icon"
              iconId="close"
              size="small"
              onClick={() => {
                const temp = [...browserItems];
                temp.splice(index, 1);
                setBrowserItems(temp);
              }}
            />
          </div>
        </div>
        <HorizontalLine />
      </>
    );
  };

  return (
    <>
      <div className={walletDescription}>
        Hook up your browser wallet to this node so you can enjoy greater
        security, privacy, and read speeds. Enable your favourite browser
        wallets below to allow access to your node. Don’t forget to add a new
        network in your wallet with the configuration below.
      </div>
      <div className={title}>Wallets</div>
      <LineLabelSettings
        items={[
          {
            sectionTitle: '',
            items: wallets.map((wallet) => {
              return getWalletItem(wallet);
            }),
          },
        ]}
      />
      <div className={advancedOptionsLink}>
        <DropdownLink
          text={`${
            isOptionsOpen
              ? tGeneric('HideAdvancedOptions')
              : tGeneric('ShowAdvancedOptions')
          }`}
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          isDown={!isOptionsOpen}
        />
      </div>
      {isOptionsOpen && (
        <div className={advancedOptions}>
          <div className={title}>Using a lesser known browser wallet?</div>
          <div className={advancedOptionsDescription}>
            If your wallet of choice is not displayed in the list above you can
            select the browser used for the extension and provide the extension
            ID to allow access.{' '}
            <ExternalLink
              url="http://google.com"
              text={tGeneric('LearnMore')}
              inline
              hideIcon
            />
          </div>
          <div className={advancedOptionsListContainer}>
            {browserItems.map((item, index) => {
              return getBrowserItem(item, index);
            })}
          </div>
          <div className={addRow}>
            <div
              onClick={() => {
                const temp = [
                  ...browserItems,
                  { browser: '', extensionId: '' },
                ];
                setBrowserItems(temp);
              }}
            >
              <Linking text="Add Row" leftIconId="add" />
            </div>
          </div>
        </div>
      )}
      <div className={walletDetails}>
        <div className={title}>Details for your new wallet network</div>
        <LineLabelSettings
          items={[
            {
              sectionTitle: '',
              items: Object.keys(networkLabels).map((key) => {
                return getNetworkItem(key);
              }),
            },
          ]}
        />
      </div>
      <ExternalLink
        text="Learn about adding a network to your wallet"
        url="https://google.com"
      />
    </>
  );
};
