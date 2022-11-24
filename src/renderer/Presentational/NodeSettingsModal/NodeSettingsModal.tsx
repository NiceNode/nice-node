import { useTranslation } from 'react-i18next';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import DynamicSettings, {
  CategoryConfig,
} from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import { ConfigValuesMap } from '../../../common/nodeConfig';
import { Message } from '../../Generics/redesign/Message/Message';
import { SettingChangeHandler } from './NodeSettingsWrapper';
import InternalLink from '../../Generics/redesign/Link/InternalLink';
import { WalletSettings } from './WalletSettings';

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
        <WalletSettings />
      </div>
    </Modal>
  );
};

export default NodeSettings;
