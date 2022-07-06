import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from './DynamicControls/Select';

const LanguageSelect = () => {
  const { i18n } = useTranslation();
  const [sLang, setLang] = useState<string>();
  const onChangeLanguage = (newLang: any) => {
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
        { label: 'Español', value: 'es' },
      ]}
      onChange={onChangeLanguage}
      menuPlacement="top"
    />
  );
};
export default LanguageSelect;
