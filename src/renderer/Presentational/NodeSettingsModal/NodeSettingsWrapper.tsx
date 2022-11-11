import { useEffect, useState } from 'react';
import {
  ConfigTranslation,
  ConfigTranslationMap,
} from '../../../common/nodeConfig';
import { CategoryConfig } from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNode } from '../../state/node';
import NodeSettings from './NodeSettings';

export interface PreferencesWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesWrapper = ({ isOpen, onClose }: PreferencesWrapperProps) => {
  const [sIsConfigDisabled, setIsConfigDisabled] = useState<boolean>(true);
  const [sConfigTranslationMap, setConfigTranslationMap] =
    useState<ConfigTranslationMap>();
  const [sCategoryConfigs, setCategoryConfigs] = useState<CategoryConfig[]>();

  const selectedNode = useAppSelector(selectSelectedNode);

  useEffect(() => {
    let isDisabled = true;
    let configTranslationMap;
    console.log(selectedNode);
    if (selectedNode) {
      isDisabled = selectedNode.status === 'running';
      configTranslationMap = selectedNode.spec.configTranslation;
    }
    console.log('NodeConfig isDisabled? ', isDisabled);
    setIsConfigDisabled(isDisabled);
    console.log(
      'DynamicSettings configValuesMap',
      selectedNode?.config.configValuesMap
    );
    console.log('DynamicSettings configTranslationMap', configTranslationMap);
    setConfigTranslationMap(configTranslationMap);
  }, [selectedNode]);
  // configTranslationMap = selectedNode.spec.configTranslation;

  useEffect(() => {
    // category to configs
    const categoryMap: Record<string, ConfigTranslationMap> = {};
    if (sConfigTranslationMap) {
      Object.keys(sConfigTranslationMap).forEach((configKey) => {
        const configTranslation: ConfigTranslation =
          sConfigTranslationMap[configKey];
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
  }, [sConfigTranslationMap]);

  return (
    <NodeSettings
      isOpen={isOpen}
      onClose={onClose}
      categoryConfigs={sCategoryConfigs}
      configValuesMap={selectedNode?.config.configValuesMap}
      isDisabled={sIsConfigDisabled}
      // themeSetting={sThemeSetting}
      // isOpenOnStartup={sIsOpenOnStartup}
      // version={sNiceNodeVersion}
      // onChange={onChangePreference}
    />
  );
};

export default PreferencesWrapper;
