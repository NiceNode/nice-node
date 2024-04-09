import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SingleValue } from 'react-select';
import type {
  ConfigTranslation,
  ConfigValuesMap,
} from '../../../common/nodeConfig';
import Button from '../../Generics/redesign/Button/Button';
import CopyButton from '../../Generics/redesign/CopyButton/CopyButton';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import Input from '../../Generics/redesign/Input/Input';
import LineLabelSettings from '../../Generics/redesign/LabelSetting/LabelSettings';
import DropdownLink from '../../Generics/redesign/Link/DropdownLink';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import Linking from '../../Generics/redesign/Link/Linking';
import Select from '../../Generics/redesign/Select/Select';
import { Toggle } from '../../Generics/redesign/Toggle/Toggle';
import {
  WALLET_BACKGROUNDS,
  type WalletBackgroundId,
} from '../../assets/images/wallets';
import type { SettingChangeHandler } from './NodeSettingsWrapper';
import {
  addRow,
  advancedOptions,
  advancedOptionsDescription,
  advancedOptionsItemContainer,
  advancedOptionsLink,
  advancedOptionsListContainer,
  buttonContainer,
  copyButtonContainer,
  inputContainer,
  networkValue,
  selectContainer,
  title,
  unableSetWallet,
  walletContainer,
  walletDescription,
  walletDetails,
  walletImage,
  walletTitle,
} from './WalletSettings.css';

export interface WalletSettingsProps {
  configValuesMap?: ConfigValuesMap;
  httpCorsConfigTranslation?: ConfigTranslation;
  onChange?: SettingChangeHandler;
}

/**
 * if joinChar and wrapChar are not given,
 * The default assumption is comma separated values without a wrapChar
 * @param param
 * @returns an array of domains
 */
const splitDomainsFromValue = ({
  rawCorsValue,
  joinChar,
  wrapChar,
}: {
  rawCorsValue?: string;
  joinChar?: string;
  wrapChar?: string;
}) => {
  let splitDomains: string[] = [];
  let parsedCorsValue = rawCorsValue;
  if (parsedCorsValue) {
    if (wrapChar) {
      if (parsedCorsValue.startsWith(wrapChar)) {
        parsedCorsValue = parsedCorsValue.substring(
          wrapChar.length,
          parsedCorsValue.length,
        );
      }
      if (parsedCorsValue.endsWith(wrapChar)) {
        parsedCorsValue = parsedCorsValue.substring(
          0,
          parsedCorsValue.length - wrapChar.length,
        );
      }
    }
    if (joinChar) {
      splitDomains = parsedCorsValue.split(joinChar);
    } else {
      // defaults to comma
      splitDomains = parsedCorsValue.split(',');
    }
  }

  return splitDomains;
};

export const WalletSettings = ({
  configValuesMap,
  httpCorsConfigTranslation,
  onChange,
}: WalletSettingsProps) => {
  const wallets = [
    {
      walletId: 'metamask',
      walletName: 'Metamask (Chrome or Brave)',
      walletAddress: 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn',
    },
    {
      walletId: 'metamask',
      walletName: 'Metamask (Firefox)',
      walletAddress: 'moz-extension://9ed7a5c5-8a81-4785-b45b-dc2ed1250aec',
    },
    {
      walletId: 'coinbase',
      walletName: 'Coinbase',
      walletAddress: 'chrome-extension://hnfanknocfeofbddgcijnmhnfnkdnaad',
    },
    {
      walletId: 'brave',
      walletName: 'Brave',
      walletAddress: 'brave://wallet',
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

  const { t } = useTranslation();
  const { t: g } = useTranslation('genericComponents');
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>();
  const splitCorsDomains = splitDomainsFromValue({
    rawCorsValue: configValuesMap?.httpCorsDomains,
    joinChar: httpCorsConfigTranslation?.valuesJoinStr,
    wrapChar: httpCorsConfigTranslation?.valuesWrapChar,
  });
  const defaultAddresses = ['nice-node://', 'http://localhost'];
  const officialWallets = wallets.map((item) => {
    return item.walletAddress;
  });

  const getOfficialWalletAddressArray = () => {
    return splitCorsDomains.filter(
      (e) => officialWallets.includes(e) && !defaultAddresses.includes(e),
    );
  };
  // filters splitCorsDomains so it only includes official wallets
  const officialWalletAddressArray = getOfficialWalletAddressArray();

  // filters splitCorsDomains so it only includes custom wallets
  const getCustomWalletAddressArray = () => {
    const filtered = splitCorsDomains.filter(
      (e) =>
        !officialWalletAddressArray.includes(e) &&
        !defaultAddresses.includes(e),
    );
    if (filtered[0] === '') {
      return null;
    }
    return filtered.map((item) => {
      const parts = item.split('://');
      const browser = parts[0].split('-extension')[0];
      return {
        browser,
        extensionId: parts[1],
      };
    });
  };

  const getWalletStringFromObject = (object: {
    browser: string;
    extensionId: string;
  }) => {
    return `${object.browser}-extension://${object.extensionId}`;
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
  ];

  const [customWalletAddressArray, setCustomWalletAddressArray] = useState(
    getCustomWalletAddressArray() || browserSettings,
  );

  const mergeAndSetNewCorsDomains = (walletsAddressArray: string[]) => {
    if (onChange) {
      // if a saved domain is not of a wallet type, keep it
      const nonWalletSavedCorsDomains = splitCorsDomains.filter((domain) => {
        return (
          !domain.includes('chrome-extension') &&
          !domain.includes('moz-extension') &&
          !domain.includes('brave')
        );
      });
      // node's configTranslationMap defines how a node likes input such as join and wrap
      //  characters for values
      let joinChar = ',';
      if (httpCorsConfigTranslation?.valuesJoinStr) {
        joinChar = httpCorsConfigTranslation.valuesJoinStr;
      }
      let wrapChar;
      if (httpCorsConfigTranslation?.valuesWrapChar) {
        wrapChar = httpCorsConfigTranslation.valuesWrapChar;
      }
      let newCorsDomains = nonWalletSavedCorsDomains
        .concat(walletsAddressArray)
        .join(joinChar);
      if (wrapChar) {
        newCorsDomains = wrapChar + newCorsDomains + wrapChar;
      }
      onChange('httpCorsDomains', `${newCorsDomains}`);
    }
  };

  /**
   * @param updatedArray the updated custom wallet array
   */
  const updateConfig = (
    updatedArray: { browser: string; extensionId: string }[],
  ) => {
    if (onChange) {
      const customWalletAddressStringsArray = updatedArray.map(
        (arrayItem: { browser: string; extensionId: string }) => {
          return getWalletStringFromObject(arrayItem);
        },
      );
      const allWalletsAddressArray = [
        ...officialWalletAddressArray,
        ...customWalletAddressStringsArray,
      ];
      mergeAndSetNewCorsDomains(allWalletsAddressArray);
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
    networkName: t('NetworkName'),
    rpcUrl: t('RpcUrl'),
    chainId: t('ChainId'),
    currencySymbol: t('CurrencySymbol'),
    blockExplorer: t('BlockExplorer'),
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
          <div className={copyButtonContainer}>
            <CopyButton
              data={networkDetails[key as keyof NetworkLabelsProps]}
            />
          </div>
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
          onText={t('Allowed')}
          offText={t('Disabled')}
          onChange={(newValue) => {
            let officialWalletsArray = officialWalletAddressArray;
            if (newValue) {
              officialWalletsArray.push(walletAddress);
            } else {
              officialWalletsArray = officialWalletsArray.filter(
                (e: string) => e !== walletAddress,
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

            mergeAndSetNewCorsDomains(allWalletsAddressArray);
          }}
        />
      ),
    };
  };

  const renderCustomWalletInput = (
    item: { browser: string; extensionId: string },
    index: number,
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
                  | undefined,
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
                { value: 'chrome', label: 'Chrome/Brave' },
                { value: 'moz', label: 'Firefox' },
              ]}
            />
          </div>
          <div className={inputContainer}>
            <Input
              placeholder={t('BrowserExtensionId')}
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
              type="ghost"
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

  if (!httpCorsConfigTranslation) {
    return (
      <div className={unableSetWallet}>{t('UnableSetWalletConnections')}</div>
    );
  }

  return (
    <>
      <div className={walletDescription}>{t('WalletDescription')}</div>
      <div className={title}>{t('Wallets')}</div>
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
            isOptionsOpen ? t('HideAdvancedOptions') : t('ShowAdvancedOptions')
          }`}
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          isDown={!isOptionsOpen}
        />
      </div>
      {isOptionsOpen && (
        <div className={advancedOptions}>
          <div className={title}>{t('UsingLesserKnownWallet')}</div>
          <div className={advancedOptionsDescription}>
            {t('SelectBrowser')}{' '}
            <ExternalLink
              url="http://google.com"
              text={g('LearnMore')}
              inline
              hideIcon
            />
          </div>
          <div className={advancedOptionsListContainer}>
            {customWalletAddressArray.map((item, index) => {
              return renderCustomWalletInput(item, index);
            })}
          </div>
          <div className={addRow}>
            <Linking
              text={t('AddRow')}
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
        <div className={title}>{t('DetailsForYourNew')}</div>
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
        text={t('LearnAboutAddingNetwork')}
        url="https://google.com"
      />
    </>
  );
};
