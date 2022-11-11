import {
  ConfigValue,
  ConfigTranslationMap,
} from '../../../../common/nodeConfig';
// eslint-disable-next-line import/no-cycle
import convertConfigToLabelSettings from './convertConfigToLabelSettings';

export type CategoryConfig = {
  category: string;
  configTranslationMap: ConfigTranslationMap;
};
export type DynamicSettingsProps = {
  categoryConfigs?: CategoryConfig[];
  configValuesMap?: unknown;
  isDisabled?: boolean;
  onChange?: (configKey: string, newValue: ConfigValue) => void;
};
const DynamicSettings = ({
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
}: DynamicSettingsProps) => {
  if (!categoryConfigs) {
    return <>No config</>;
  }

  const onNodeConfigChange = async (
    configKey: string,
    newValue: ConfigValue
  ) => {
    // updateNode
    console.log('updating node with newValue: ', newValue);
    if (onChange) {
      onChange(configKey, newValue);
    }
  };

  return (
    <>
      {convertConfigToLabelSettings({
        categoryConfigs: categoryConfigs ?? [],
        configValuesMap,
        isDisabled,
      })}
    </>
  );
};
export default DynamicSettings;
