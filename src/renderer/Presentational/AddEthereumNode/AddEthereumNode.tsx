import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { container, descriptionFont, titleFont } from './addEthereumNode.css';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';

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
      <div>Stuff</div>
    </div>
  );
};

export default AddEthereumNode;
