import { ConfigTranslation } from '../../../../common/nodeConfig';
import LineLabelSettings, {
  LineLabelSettingsProps,
} from '../LabelSetting/LabelSettings';
import LabelSettingsSection, {
  LabelSettingsItem,
  LabelSettingsSectionProps,
} from '../LabelSetting/LabelValuesSection';
// eslint-disable-next-line import/no-cycle
import { CategoryConfig } from './DynamicSettings';
import Setting from './Setting';

const convertConfigToLabelSettings = (
  categoryConfigs: CategoryConfig[],
  configValuesMap: any
): React.ReactNode => {
  // let lineLabelSettingsProps: LineLabelSettingsProps = {
  //   items: [],
  // };
  console.log(
    'settings categoryConfigs, configValuesMap: ',
    categoryConfigs,
    configValuesMap
  );

  // no separate settings sections (Only one for now)
  const section: LabelSettingsSectionProps = {
    // sectionTitle: category
    items: [],
  };
  const configItems = categoryConfigs.map((categoryConfig) => {
    const { configTranslationMap, category } = categoryConfig;

    if (configTranslationMap) {
      const categoryItems = Object.keys(configTranslationMap).map(
        (configKey) => {
          const configTranslation: ConfigTranslation =
            configTranslationMap[configKey];

          let currentValue: string | string[] = configValuesMap?.[configKey];
          if (currentValue === undefined) {
            if (configTranslation.niceNodeDefaultValue !== undefined) {
              currentValue = configTranslation.niceNodeDefaultValue;
            } else if (configTranslation.defaultValue !== undefined) {
              currentValue = configTranslation.defaultValue;
            }
            // todo for mutli select?
          }
          const settingItem: LabelSettingsItem = {
            label: configTranslation.displayName,
            value: (
              <Setting
                key={configKey}
                configKey={configKey}
                configTranslation={configTranslation}
                currentValue={currentValue}
              />
            ),
          };
          if (configTranslation.infoDescription) {
            settingItem.description = configTranslation.infoDescription;
          }
          if (configTranslation.documentation) {
            settingItem.learnMoreLink = configTranslation.documentation;
          }
          console.log('settings settingItem: ', settingItem);
          return settingItem;
        }
      );
      section.items = section.items.concat(categoryItems);
    }

    console.log('settings section: ', section);
    return section;
  });
  return <LineLabelSettings items={[section]} />;
};
export default convertConfigToLabelSettings;
