import { useTranslation } from 'react-i18next';
import Select from './DynamicControls/Select';
import { useGetSettingsQuery } from './state/settingsService';
import electron from './electronGlobal';
import { Settings } from '../main/state/settings';

const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const qSettings = useGetSettingsQuery();

  // always is string, but type can be string | string[] | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeLanguage = async (newLang: any) => {
    console.log('language selected: ', newLang);
    i18n.changeLanguage(newLang);
    await electron.setLanguage(newLang);
    qSettings.refetch();
    // todo: electron.setLang
  };

  let appLanguage = 'en';
  if (qSettings?.data) {
    const settings: Settings = qSettings.data;
    if (settings.appLanguage) {
      appLanguage = settings.appLanguage;
    } else if (settings.osLanguage) {
      // Only 2-letter language codes supported right now
      //   OS's can return 4+ letter language codes
      appLanguage = settings.osLanguage.substring(0, 2);
    }
    // This will set the language when the app loads.
    if (appLanguage !== i18n.language) {
      i18n.changeLanguage(appLanguage);
    }
  }

  return (
    <Select
      isDisabled={false}
      value={appLanguage}
      isMulti={false}
      options={[
        { label: 'English', value: 'en' },
        { label: 'Chinese', value: 'cn' },
        { label: 'Español', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Japanese', value: 'ja' },
        { label: 'Vietnamese', value: 'vi' },
      ]}
      onChange={onChangeLanguage}
      menuPlacement="top"
    />
  );
};
export default LanguageSelect;
