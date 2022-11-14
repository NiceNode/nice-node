import {
  ConfigTranslation,
  ConfigValuesMap,
} from '../../../../common/nodeConfig';
import { SettingChangeHandler } from '../../../Presentational/NodeSettingsModal/NodeSettingsWrapper';
import {
  LabelSettingsItem,
  LabelSettingsSectionProps,
} from '../LabelSetting/LabelValuesSection';
import { CategoryConfig } from './DynamicSettings';
import Setting from './Setting';

const getConfigValue = (
  configTranslation: ConfigTranslation,
  configKey: string,
  configValuesMap: ConfigValuesMap
) => {
  let currentValue: string | string[] = configValuesMap?.[configKey];
  if (currentValue === undefined) {
    if (configTranslation.niceNodeDefaultValue !== undefined) {
      currentValue = configTranslation.niceNodeDefaultValue;
    } else if (configTranslation.defaultValue !== undefined) {
      currentValue = configTranslation.defaultValue;
    }
  }
  return currentValue;
};

const convertConfigToLabelSettings = ({
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
}: {
  categoryConfigs: CategoryConfig[];
  configValuesMap: ConfigValuesMap;
  isDisabled?: boolean;
  onChange?: SettingChangeHandler;
}): LabelSettingsSectionProps => {
  // no separate settings sections (Only one for now)
  const section: LabelSettingsSectionProps = {
    items: [],
  };

  // We're parsing the settings obj to form a categories array
  // which contains the settings for each category
  const configSettingsItems: LabelSettingsItem[][] = categoryConfigs.map(
    (categoryConfig) => {
      const { configTranslationMap } = categoryConfig;

      if (configTranslationMap) {
        // categorySettingsArr: An array of all the Settings in this category
        const categorySettingsArr: LabelSettingsItem[] = Object.keys(
          configTranslationMap
        ).map((configKey) => {
          const configTranslation: ConfigTranslation =
            configTranslationMap[configKey];

          const currentValue: string | string[] = getConfigValue(
            configTranslation,
            configKey,
            configValuesMap
          );

          const settingItem: LabelSettingsItem = {
            label: configTranslation.displayName,
            value: (
              <Setting
                key={configKey}
                configKey={configKey}
                configTranslation={configTranslation}
                currentValue={currentValue}
                isDisabled={isDisabled}
                onChange={onChange}
              />
            ),
          };
          if (configTranslation.infoDescription) {
            settingItem.description = configTranslation.infoDescription;
          }
          if (configTranslation.documentation) {
            settingItem.learnMoreLink = configTranslation.documentation;
          }
          return settingItem;
        });
        return categorySettingsArr;
      }
      // config with translation? todo: error
      console.error(
        'category config does not have a configTranslation',
        categoryConfig
      );
      return [];
    }
  );
  // End of parsing category settings
  // Now flatten them into one category or "section"
  if (configSettingsItems) {
    configSettingsItems.forEach((categorySettingsArr) => {
      section.items = section.items.concat(categorySettingsArr);
    });
  }
  return section;
};
export default convertConfigToLabelSettings;
