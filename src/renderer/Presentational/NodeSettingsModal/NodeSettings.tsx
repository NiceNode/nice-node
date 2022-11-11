import { useTranslation } from 'react-i18next';

import { Modal } from '../../Generics/redesign/Modal/Modal';
import DynamicSettings, {
  CategoryConfig,
} from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import { ConfigValuesMap } from '../../../common/nodeConfig';
import { Message } from '../../Generics/redesign/Message/Message';

export type ThemeSetting = 'light' | 'dark' | 'auto';
export type Preference = 'theme' | 'isOpenOnStartup';
export interface NodeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  categoryConfigs?: CategoryConfig[];
  configValuesMap?: ConfigValuesMap;
  isDisabled?: boolean;
  onChange?: () => void;
}

const NodeSettings = ({
  isOpen,
  onClose,
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
}: NodeSettingsProps) => {
  const { t } = useTranslation('genericComponents');

  const onChangeSetting = () => {
    if (onChange) {
      onChange();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={t('Node settings')}
      onClickCloseButton={onClose}
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
      />
    </Modal>
  );
};

export default NodeSettings;
