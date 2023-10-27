import { SingleValue } from 'react-select';
import Select from './Generics/redesign/Select/Select';

export interface LanguageSelectProps {
  language?: string;
  onChange?: (value: string) => void;
}

const LanguageSelect = ({ onChange, language }: LanguageSelectProps) => {
  // always is string, but type can be string | string[] | undefined
  const onChangeLanguage = async (
    newLang: SingleValue<{ value: string; label: string }> | undefined,
  ) => {
    console.log('language selected: ', newLang);
    if (newLang && onChange) {
      const lang = newLang.value;
      onChange(lang);
    }
  };
  return (
    <Select
      value={language}
      options={[
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
        { label: 'Chinese', value: 'zh' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Japanese', value: 'ja' },
        { label: 'Russian', value: 'ru' },
        { label: 'Vietnamese', value: 'vi' },
      ]}
      onChange={onChangeLanguage}
      menuPlacement="top"
    />
  );
};
export default LanguageSelect;
