import { useTranslation } from 'react-i18next';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import DynamicSettings, {
  CategoryConfig,
} from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import { ConfigTranslation, ConfigValuesMap } from '../../../common/nodeConfig';
import { Message } from '../../Generics/redesign/Message/Message';
import { SettingChangeHandler } from './NodeSettingsWrapper';
import InternalLink from '../../Generics/redesign/Link/InternalLink';
import { WalletSettings } from './WalletSettings';
import { Tabs } from '../../Generics/redesign/Tabs/Tabs';
import Button from '../../Generics/redesign/Button/Button';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';
export interface NodeSettingsProps {
  isOpen: boolean;
  onClickClose: () => void;
  categoryConfigs?: CategoryConfig[];
  configValuesMap?: ConfigValuesMap;
  httpCorsConfigTranslation?: ConfigTranslation;
  isWalletSettingsEnabled?: boolean;
  isDisabled?: boolean;
  onChange?: SettingChangeHandler;
  onClickRemoveNode: () => void;
  nodeStartCommand?: string;
}

const NodeSettings = ({
  isOpen,
  onClickClose,
  categoryConfigs,
  configValuesMap,
  httpCorsConfigTranslation,
  isWalletSettingsEnabled,
  isDisabled,
  onChange,
  onClickRemoveNode,
  nodeStartCommand,
}: NodeSettingsProps) => {
  const { t: tNiceNode } = useTranslation();

  const renderTabs = () => {
    const tabs = [];
    tabs.push(
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
        <p>Node start command</p>
        {nodeStartCommand && (
          <div style={{ display: 'flex', paddingTop: 8 }}>
            <p style={{ fontFamily: 'monospace' }}>{nodeStartCommand}</p>
            <Button
              type="ghost"
              iconId="copy"
              variant="icon"
              onClick={() => {
                if (nodeStartCommand) {
                  navigator.clipboard.writeText(nodeStartCommand);
                }
              }}
            />
          </div>
        )}
        {/* Remove Node link */}
        <div style={{ padding: '16px 0px 16px 0px' }}>
          <InternalLink
            text={tNiceNode('RemoveThisNode')}
            onClick={onClickRemoveNode}
            danger
          />
        </div>
      </div>
    );

    if (isWalletSettingsEnabled) {
      tabs.push(
        <div id="Wallet Connections">
          <WalletSettings
            configValuesMap={configValuesMap}
            httpCorsConfigTranslation={httpCorsConfigTranslation}
            onChange={onChange}
          />
        </div>
      );
    }
    return tabs;
  };

  return (
    <Modal
      isOpen={isOpen}
      title={tNiceNode('NodeSettings')}
      onClickCloseButton={onClickClose}
    >
      <Tabs modal>{renderTabs()}</Tabs>
    </Modal>
  );
};

export default NodeSettings;
