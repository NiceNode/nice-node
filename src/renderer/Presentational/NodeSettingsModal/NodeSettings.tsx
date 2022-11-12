import { useTranslation } from 'react-i18next';

import { Modal } from '../../Generics/redesign/Modal/Modal';
import DynamicSettings, {
  CategoryConfig,
} from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import { ConfigValuesMap } from '../../../common/nodeConfig';
import { Message } from '../../Generics/redesign/Message/Message';
import { SettingChangeHandler } from './NodeSettingsWrapper';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';
export interface NodeSettingsProps {
  isOpen: boolean;
  onClickClose: () => void;
  categoryConfigs?: CategoryConfig[];
  configValuesMap?: ConfigValuesMap;
  isDisabled?: boolean;
  onChange?: SettingChangeHandler;
}

const NodeSettings = ({
  isOpen,
  onClickClose,
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
}: NodeSettingsProps) => {
  const { t } = useTranslation('genericComponents');

  return (
    <Modal
      isOpen={isOpen}
      title={t('Node settings')}
      onClickCloseButton={onClickClose}
    >
      {isDisabled && (
        <Message
          type="warning"
          title="The node must be stopped to make changes"
        />
      )}
      {/* todo: tab1 */}
      <DynamicSettings
        categoryConfigs={categoryConfigs}
        configValuesMap={configValuesMap}
        isDisabled={isDisabled}
        onChange={onChange}
      />
    </Modal>
  );
};

export default NodeSettings;
