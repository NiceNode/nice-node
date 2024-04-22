import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from '../renderer/Generics/redesign/Select/Select';

const StorybookLanguageSelect = () => {
  const { i18n } = useTranslation();
  const [sLang, setLang] = useState<string>('en');

  const onChangeLanguage = async (newLang: any) => {
    console.log('language selected: ', newLang.value);
    setLang(newLang.value);
    i18n.changeLanguage(newLang.value);
  };

  return (
    <Select
      isDisabled={false}
      value={sLang}
      options={[
        { label: 'English', value: 'en' },
        { label: 'Chinese', value: 'zh' },
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
