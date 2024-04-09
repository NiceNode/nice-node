import { useMemo } from 'react';
import type {
  ConfigTranslationMap,
  ConfigValuesMap,
} from '../../../../common/nodeConfig';
import type { SettingChangeHandler } from '../../../Presentational/NodeSettings/NodeSettingsWrapper';
import LineLabelSettings from '../LabelSetting/LabelSettings';
import convertConfigToLabelSettings from './convertConfigToLabelSettings';

export type CategoryConfig = {
  category: string;
  configTranslationMap: ConfigTranslationMap;
};
export type DynamicSettingsProps = {
  categoryConfigs?: CategoryConfig[];
  configValuesMap?: ConfigValuesMap;
  isDisabled?: boolean;
  onChange?: SettingChangeHandler;
  type?: string;
  required?: boolean;
  flow?: string;
};
const DynamicSettings = ({
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
  type,
  required,
  flow,
}: DynamicSettingsProps) => {
  const sSections = useMemo(() => {
    return convertConfigToLabelSettings({
      categoryConfigs: categoryConfigs ?? [],
      configValuesMap: configValuesMap ?? {},
      isDisabled,
      onChange,
      required,
      flow,
    });
  }, [categoryConfigs, configValuesMap, isDisabled, onChange, required, flow]);

  if (!categoryConfigs) {
    return <>No node settings found.</>;
  }

  return (
    <>
      <LineLabelSettings type={type} items={[sSections]} />
    </>
  );
};
export default DynamicSettings;
