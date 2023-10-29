import { useMemo } from 'react';
import {
  ConfigTranslationMap,
  ConfigValuesMap,
} from '../../../../common/nodeConfig';
import { SettingChangeHandler } from '../../../Presentational/NodeSettings/NodeSettingsWrapper';
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
};
const DynamicSettings = ({
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
  type,
}: DynamicSettingsProps) => {
  const sSections = useMemo(() => {
    return convertConfigToLabelSettings({
      categoryConfigs: categoryConfigs ?? [],
      configValuesMap: configValuesMap ?? {},
      isDisabled,
      onChange,
    });
  }, [categoryConfigs, configValuesMap, isDisabled, onChange]);

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
