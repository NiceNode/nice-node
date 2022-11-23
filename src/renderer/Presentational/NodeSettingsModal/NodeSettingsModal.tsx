import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { Modal } from '../../Generics/redesign/Modal/Modal';
import DynamicSettings, {
  CategoryConfig,
} from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import { ConfigValuesMap } from '../../../common/nodeConfig';
import { Message } from '../../Generics/redesign/Message/Message';
import { SettingChangeHandler } from './NodeSettingsWrapper';
import InternalLink from '../../Generics/redesign/Link/InternalLink';
import LineLabelSettings from '../../Generics/redesign/LabelSetting/LabelSettings';
import { Toggle } from '../../Generics/redesign/Toggle/Toggle';
import DropdownLink from '../../Generics/redesign/Link/DropdownLink';
import { walletDescription, walletsTitle } from './NodeSettingsModal.css';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';
export interface NodeSettingsProps {
  isOpen: boolean;
  onClickClose: () => void;
  categoryConfigs?: CategoryConfig[];
  configValuesMap?: ConfigValuesMap;
  isDisabled?: boolean;
  onChange?: SettingChangeHandler;
  onClickRemoveNode: () => void;
}

const NodeSettings = ({
  isOpen,
  onClickClose,
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
  onClickRemoveNode,
}: NodeSettingsProps) => {
  const { t: tNiceNode } = useTranslation();
  const { t: tGeneric } = useTranslation('genericComponents');
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>();

  return (
    <Modal
      isOpen={isOpen}
      title={tNiceNode('NodeSettings')}
      onClickCloseButton={onClickClose}
      tabs
    >
      <div id="General">
        {isDisabled && (
          <Message
            type="warning"
            title={tNiceNode('StopeNodeToChangeSettings')}
          />
        )}
        {/* todo: tab1 */}
        <DynamicSettings
          categoryConfigs={categoryConfigs}
          configValuesMap={configValuesMap}
          isDisabled={isDisabled}
          onChange={onChange}
        />
        {/* Remove Node link */}
        <InternalLink
          text={tNiceNode('RemoveThisNode')}
          onClick={onClickRemoveNode}
          danger
        />
      </div>
      <div id="Wallet Connections">
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
              items: [
                {
                  label: <div>Metamask</div>,
                  value: (
                    <Toggle
                      // checked={isOpenOnStartup}
                      onChange={(newValue) => {
                        console.log(newValue);
                      }}
                    />
                  ),
                },
                {
                  label: 'Coinbase Wallet',
                  value: (
                    <Toggle
                      // checked={isOpenOnStartup}
                      onChange={(newValue) => {
                        console.log(newValue);
                      }}
                    />
                  ),
                },
                {
                  label: 'Brave Wallet',
                  value: (
                    <Toggle
                      // checked={isOpenOnStartup}
                      onChange={(newValue) => {
                        console.log(newValue);
                      }}
                    />
                  ),
                },
                {
                  label: 'TallyHo!',
                  value: (
                    <Toggle
                      // checked={isOpenOnStartup}
                      onChange={(newValue) => {
                        console.log(newValue);
                      }}
                    />
                  ),
                },
                {
                  label: 'Argent',
                  value: (
                    <Toggle
                      // checked={isOpenOnStartup}
                      onChange={(newValue) => {
                        console.log(newValue);
                      }}
                    />
                  ),
                },
              ],
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
            <span style={{ fontWeight: 600 }}>{tGeneric('Network')}</span>{' '}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NodeSettings;
