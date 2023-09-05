import { useTranslation } from 'react-i18next';
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
import {
  nodeCommandTitle,
  nodeCommandContainer,
  nodeCommand,
  emptyContainer,
} from './NodeSettings.css';

export interface NodeSettingsProps {
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
  categoryConfigs,
  configValuesMap,
  httpCorsConfigTranslation,
  isWalletSettingsEnabled,
  isDisabled,
  onChange,
  onClickRemoveNode,
  nodeStartCommand,
}: NodeSettingsProps) => {
  const { t } = useTranslation();

  if (!categoryConfigs || categoryConfigs.length === 0) {
    return <div className={emptyContainer} />;
  }

  const renderTabs = () => {
    const tabs = [];
    tabs.push(
      <div id={t('General')}>
        {isDisabled && (
          <Message type="warning" title={t('StopeNodeToChangeSettings')} />
        )}
        {/* todo: tab1 */}
        <DynamicSettings
          type="modal"
          categoryConfigs={categoryConfigs}
          configValuesMap={configValuesMap}
          isDisabled={isDisabled}
          onChange={onChange}
        />
        {nodeStartCommand && (
          <>
            <p className={nodeCommandTitle}>
              Node start command (must save changes to take effect)
            </p>
            <div className={nodeCommandContainer}>
              <p className={nodeCommand}>{nodeStartCommand}</p>
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
          </>
        )}
        {/* Remove Node link */}
        <div style={{ padding: '16px 0px 16px 0px' }}>
          <InternalLink
            text={t('RemoveThisNode')}
            onClick={onClickRemoveNode}
            danger
          />
        </div>
      </div>,
    );

    if (isWalletSettingsEnabled) {
      tabs.push(
        <div id={t('WalletConnections')}>
          <WalletSettings
            configValuesMap={configValuesMap}
            httpCorsConfigTranslation={httpCorsConfigTranslation}
            onChange={onChange}
          />
        </div>,
      );
    }
    return tabs;
  };

  return <Tabs modal>{renderTabs()}</Tabs>;
};

export default NodeSettings;
