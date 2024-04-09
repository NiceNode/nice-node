import type {
  ConfigTranslation,
  ConfigValuesMap,
} from '../../../../common/nodeConfig';
import type { SettingChangeHandler } from '../../../Presentational/NodeSettings/NodeSettingsWrapper';
import type {
  LabelSettingsItem,
  LabelSettingsSectionProps,
} from '../LabelSetting/LabelValuesSection';
import type { CategoryConfig } from './DynamicSettings';
import Setting from './Setting';

const convertConfigToLabelSettings = ({
  categoryConfigs,
  configValuesMap,
  isDisabled,
  onChange,
  required,
  flow,
}: {
  categoryConfigs: CategoryConfig[];
  configValuesMap: ConfigValuesMap;
  isDisabled?: boolean;
  onChange?: SettingChangeHandler;
  required?: boolean;
  flow?: string;
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
          configTranslationMap,
        ).map((configKey) => {
          const configTranslation: ConfigTranslation =
            configTranslationMap[configKey];

          const currentValue: string | string[] | undefined =
            configValuesMap?.[configKey];

          const keyDisabled =
            (configKey === 'syncMode' || configKey === 'dataStorageFormat') &&
            flow === 'nodeSettings'
              ? true
              : isDisabled;

          const settingItem: LabelSettingsItem = {
            key: configKey,
            label: configTranslation.displayName,
            value: (
              <Setting
                key={configKey}
                configKey={configKey}
                configTranslation={configTranslation}
                currentValue={currentValue}
                isDisabled={keyDisabled}
                onChange={onChange}
                required={required}
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
        categoryConfig,
      );
      return [];
    },
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
