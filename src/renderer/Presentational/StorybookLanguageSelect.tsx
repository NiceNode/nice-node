import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Select from '../DynamicControls/Select';

const StorybookLanguageSelect = () => {
  const { i18n } = useTranslation();
  const [sLang, setLang] = useState<string>('en');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeLanguage = async (newLang: any) => {
    console.log('language selected: ', newLang);
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <Select
      isDisabled={false}
      value={sLang}
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
export default StorybookLanguageSelect;
