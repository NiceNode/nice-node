import { useEffect, useState } from 'react';
import {
  ConfigValue,
  ConfigTranslationMap,
  ConfigTranslation,
  ConfigTranslationControl,
} from '../../../../common/nodeConfig';
import convertConfigToLabelSettings from './convertConfigToLabelSettings';
import Select from './DynamicControls/Select';
import TextArea from './DynamicControls/TextArea';
import Setting from './Setting';
// import Warning from '../Warning';
// import { InfoModal } from '../InfoIconButton';
// import ExternalLink from '../Generics/ExternalLink';

export type CategoryConfig = {
  category: string;
  configTranslationMap: ConfigTranslationMap;
};
// isDisabled? selectedNodeId (for dialog)
export type DynamicSettingsProps = {
  configTranslationMap: ConfigTranslationMap;
  configValuesMap: any;
  onChange?: (configKey: string, newValue: ConfigValue) => void;
};
// configTranslationMap = selectedNode.spec.configTranslation;
const DynamicSettings = ({
  configTranslationMap,
  configValuesMap,
  onChange,
}: DynamicSettingsProps) => {
  const [sCategoryConfigs, setCategoryConfigs] = useState<CategoryConfig[]>();

  useEffect(() => {
    // category to configs
    const categoryMap: Record<string, ConfigTranslationMap> = {};
    if (configTranslationMap) {
      Object.keys(configTranslationMap).forEach((configKey) => {
        const configTranslation: ConfigTranslation =
          configTranslationMap[configKey];
        const category = configTranslation.category ?? 'Other';
        if (!categoryMap[category]) {
          categoryMap[category] = {};
        }
        categoryMap[category][configKey] = configTranslation;
      });
    }
    const arr = Object.keys(categoryMap).map((category) => {
      return {
        category,
        configTranslationMap: categoryMap[category],
      };
    });

    // Put 'Other' category at the bottom
    arr.sort((x, y) => {
      if (x.category === 'Other') {
        return 1;
      }
      if (y.category === 'Other') {
        return -1;
      }
      return 0;
    });

    setCategoryConfigs(arr);
  }, [configTranslationMap]);

  if (!configTranslationMap) {
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
    <>{convertConfigToLabelSettings(sCategoryConfigs ?? [], configValuesMap)}</>
  );
};
export default DynamicSettings;
