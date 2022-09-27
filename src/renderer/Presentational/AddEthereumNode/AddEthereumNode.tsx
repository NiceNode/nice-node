import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  container,
  descriptionFont,
  sectionFont,
  titleFont,
} from './addEthereumNode.css';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import SpecialSelect from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import electron from '../../electronGlobal';
import { Button } from '../../Generics/redesign/Button/Button';
import Input from '../../Generics/redesign/Input/Input';
import DropdownLink from '../../Generics/redesign/Link/DropdownLink';

export interface AddEthereumNodeProps {
  /**
   * Listen to node config changes
   */
  onChange: (newValue: string) => void;
}

/**
 * Primary UI component for user interaction
 */
const AddEthereumNode = ({ onChange }: AddEthereumNodeProps) => {
  const { t } = useTranslation();
  const [sIsOptionsOpen, setIsOptionsOpen] = useState<boolean>();

  return (
    <div className={container}>
      <div className={titleFont}>{t('EthereumNode')}</div>
      <div className={descriptionFont}>
        <>{t('AddEthereumNodeDescription')}</>
      </div>
      <ExternalLink
        text={t('LearnMoreClientDiversity')}
        url="https://ethereum.org/en/developers/docs/nodes-and-clients/client-diversity/"
      />
      <p className={sectionFont}>Recommended execution client</p>
      <SpecialSelect onChange={(newEc) => console.log('val', newEc)} />
      <p className={sectionFont}>Recommended consensus client</p>
      <SpecialSelect onChange={(newcc) => console.log('val', newcc)} />
      <p className={sectionFont}>Data location</p>
      <DropdownLink
        text={`${sIsOptionsOpen ? 'Hide' : 'Show'} advanced options`}
        onClick={() => setIsOptionsOpen(!sIsOptionsOpen)}
        isDown={!sIsOptionsOpen}
      />
      {sIsOptionsOpen && (
        <div>
          <span>Network</span>
          <span />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '4px',
          width: '100%',
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <Input disabled placeholder="files/" />
        </div>
        <Button
          size="small"
          label="Change..."
          onClick={() => electron.openDialogForNodeDataDir('')}
        />
      </div>
    </div>
  );
};

export default AddEthereumNode;
