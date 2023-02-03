import { useEffect, useState } from 'react';
import {
  ConfigTranslationMap,
  ConfigValuesMap,
} from '../../../../common/nodeConfig';
import { SettingChangeHandler } from '../../../Presentational/NodeSettings/NodeSettingsWrapper';
import LineLabelSettings from '../LabelSetting/LabelSettings';
import { LabelSettingsSectionProps } from '../LabelSetting/LabelValuesSection';
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
};
const DynamicSettings = ({
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
}: DynamicSettingsProps) => {
  const [sSections, setSections] = useState<LabelSettingsSectionProps>({
    items: [],
  });

  useEffect(() => {
    setSections(
      convertConfigToLabelSettings({
        categoryConfigs: categoryConfigs ?? [],
        configValuesMap: configValuesMap ?? {},
        isDisabled,
        onChange,
      })
    );
  }, [categoryConfigs, configValuesMap, isDisabled, onChange]);

  if (!categoryConfigs) {
    return <>No node settings found.</>;
  }

  return (
    <>
      <LineLabelSettings items={[sSections]} />
    </>
  );
};
export default DynamicSettings;
