import { useTranslation } from 'react-i18next';

import {
  container,
  descriptionFont,
  sectionFont,
  titleFont,
} from './addNode.css';
import SpecialSelect from '../../Generics/redesign/SpecialSelect/SpecialSelect';

export interface AddNodeProps {
  /**
   * Listen to node config changes
   */
  onChange: (newValue: string) => void;
}

const networksOptions = [
  {
    value: 'ethereum',
    iconId: 'ethereum',
    title: 'Ethereum',
    info: 'The world computer',
  },
];

const AddNode = ({ onChange }: AddNodeProps) => {
  const { t } = useTranslation();

  return (
    <div className={container}>
      <div className={titleFont}>{t('AddYourFirstNode')}</div>
      <div className={descriptionFont}>
        <>{t('AddYourFirstNodeDescription')}</>
      </div>
      <p className={sectionFont}>{t('ChooseYourNetwork')}</p>
      <SpecialSelect
        options={networksOptions}
        onChange={(selectedNetwork) => onChange(selectedNetwork)}
      />
    </div>
  );
};

export default AddNode;
