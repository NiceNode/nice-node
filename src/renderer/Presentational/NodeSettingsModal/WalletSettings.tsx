import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ConfigValuesMap } from 'common/nodeConfig';
import { SingleValue } from 'react-select';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import Input from '../../Generics/redesign/Input/Input';
import Button from '../../Generics/redesign/Button/Button';
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
import { SettingChangeHandler } from './NodeSettingsWrapper';

export interface WalletSettingsProps {
  configValuesMap?: ConfigValuesMap;
  onChange?: SettingChangeHandler;
}

export const WalletSettings = ({
  onChange,
  configValuesMap,
}: WalletSettingsProps) => {
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

  const { t: tGeneric } = useTranslation('genericComponents');
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>();
  const allWallets = configValuesMap?.httpCorsDomains.split(',') || [];
  const defaultAddresses = ['nice-node://', 'http://localhost'];
  const officialWallets = wallets.map((item) => {
    return item.walletAddress;
  });

  const getOfficialWalletAddressArray = () => {
    return allWallets.filter(
      (e) => officialWallets.includes(e) && !defaultAddresses.includes(e)
    );
  };
  // filters allWallets so it only includes official wallets
  const officialWalletAddressArray = getOfficialWalletAddressArray();

  // filters allWallets so it only includes custom wallets
  const getCustomWalletAddressArray = () => {
    const filtered = allWallets.filter(
      (e) =>
        !officialWalletAddressArray.includes(e) && !defaultAddresses.includes(e)
    );
    if (filtered[0] === '') {
      return null;
    }
    return filtered.map((item) => {
      const parts = item.split('://');
      return {
        browser: parts[0],
        extensionId: parts[1],
      };
    });
  };

  const getWalletStringFromObject = (object: {
    browser: string;
    extensionId: string;
  }) => {
    return `${object.browser}://${object.extensionId}`;
  };

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

  const [customWalletAddressArray, setCustomWalletAddressArray] = useState(
    getCustomWalletAddressArray() || browserSettings
  );

  const updateConfig = (
    updatedArray: { browser: string; extensionId: string }[]
  ) => {
    if (onChange) {
      const customWalletAddressStringsArray = updatedArray.map(
        (arrayItem: { browser: string; extensionId: string }) => {
          return getWalletStringFromObject(arrayItem);
        }
      );
      const allWalletsAddressArray = [
        ...officialWalletAddressArray,
        ...customWalletAddressStringsArray,
      ];
      onChange('httpCorsDomains', allWalletsAddressArray.toString());
    }
  };

  interface WalletProps {
    walletId: WalletBackgroundId;
    walletName: string;
    walletAddress: string;
  }

  type NetworkLabelsProps = {
    networkName: string;
    rpcUrl: string;
    chainId: string;
    currencySymbol: string;
    blockExplorer: string;
  };

  const networkLabels = {
    networkName: 'Network Name',
    rpcUrl: 'New RPC URL',
    chainId: 'Chain ID',
    currencySymbol: 'Currency Symbol',
    blockExplorer: 'Block explorer',
  };

  // fetch this from data layer
  const networkDetails = {
    networkName: 'Ethereum Mainnet (NiceNode)',
    rpcUrl: 'http://localhost:8545',
    chainId: '1',
    currencySymbol: 'ETH',
    blockExplorer: 'https://etherscan.io',
  };

  const getNetworkItem = (key: string) => {
    return {
      label: networkLabels[key as keyof NetworkLabelsProps],
      value: (
        <div className={networkValue}>
          <div>{networkDetails[key as keyof NetworkLabelsProps]}</div>
          <Button
            ghost
            iconId="copy"
            variant="icon"
            onClick={() => {
              navigator.clipboard.writeText(
                networkDetails[key as keyof NetworkLabelsProps]
              );
            }}
          />
        </div>
      ),
    };
  };

  const getWalletItem = (wallet: WalletProps) => {
    const { walletId, walletAddress, walletName } = wallet;
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
          checked={officialWalletAddressArray.includes(walletAddress)}
          onText="Allowed"
          offText="Disabled"
          onChange={(newValue) => {
            let officialWalletsArray = officialWalletAddressArray;
            if (newValue) {
              officialWalletsArray.push(walletAddress);
            } else {
              officialWalletsArray = officialWalletsArray.filter(
                (e: string) => e !== walletAddress
              );
            }

            const customWalletAddressStringsArray =
              customWalletAddressArray.map((item) => {
                return getWalletStringFromObject(item);
              });

            // take the new official wallet array, and combine with existing custom wallet address array
            const allWalletsAddressArray = [
              ...officialWalletsArray,
              ...customWalletAddressStringsArray,
            ];

            if (onChange) {
              onChange('httpCorsDomains', allWalletsAddressArray.toString());
            }
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
          <div className={selectContainer}>
            <Select
              value={item.browser}
              onChange={(
                newValue:
                  | SingleValue<{ value: string; label: string }>
                  | undefined
              ) => {
                if (newValue) {
                  const { value } = newValue;
                  const updatedArray = customWalletAddressArray;
                  // string exists already, so update the browser
                  const { extensionId } = updatedArray[index];
                  updatedArray[index] = {
                    browser: value,
                    extensionId,
                  };
                  setCustomWalletAddressArray(updatedArray);
                  updateConfig(updatedArray);
                }
              }}
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
              onChange={(value) => {
                const updatedArray = customWalletAddressArray;
                // string exists already, so update the extensionId
                const { browser } = updatedArray[index];
                updatedArray[index] = {
                  browser,
                  extensionId: value,
                };
                setCustomWalletAddressArray(updatedArray);
                updateConfig(updatedArray);
              }}
            />
          </div>
          <div className={buttonContainer}>
            <Button
              ghost
              variant="icon"
              iconId="close"
              size="small"
              onClick={() => {
                const updatedArray = [...customWalletAddressArray];
                updatedArray.splice(index, 1);
                setCustomWalletAddressArray(updatedArray);
                updateConfig(updatedArray);
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
              return getWalletItem(wallet as WalletProps);
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
            {customWalletAddressArray.map((item, index) => {
              return getBrowserItem(item, index);
            })}
          </div>
          <div className={addRow}>
            <Linking
              text="Add Row"
              leftIconId="add"
              onClick={() => {
                const updatedArray = [
                  ...customWalletAddressArray,
                  { browser: 'chrome', extensionId: '' },
                ];
                setCustomWalletAddressArray(updatedArray);
              }}
            />
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
