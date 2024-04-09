import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { SystemRequirements } from '../../../common/systemRequirements';
import type { SystemData } from '../../../main/systemInfo';
import { Checklist } from '../../Generics/redesign/Checklist/Checklist';
import type { ChecklistItemProps } from '../../Generics/redesign/Checklist/ChecklistItem';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import electron from '../../electronGlobal';
import {
  checklistContainer,
  container,
  descriptionFont,
  titleFont,
} from './nodeRequirements.css';
import { makeCheckList } from './requirementsChecklistUtil';

export interface NodeRequirementsProps {
  /**
   * Node requirements
   */
  nodeRequirements?: SystemRequirements;
  /**
   * Title of the checklist
   */
  systemData?: SystemData;
  /**
   * A folder path where the node data will be stored.
   */
  nodeStorageLocation?: string;
  type?: string;
}

const NodeRequirements = ({
  nodeRequirements,
  nodeStorageLocation,
  type,
}: NodeRequirementsProps) => {
  const { t } = useTranslation('systemRequirements');
  const [sItems, setItems] = useState<ChecklistItemProps[]>([]);
  const [sSystemData, setSystemData] = useState<SystemData>();

  const getData = async () => {
    setSystemData(await electron.getSystemInfo());
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // determine checkList and status
    // for each node req, determine if systemData meets it
    // Object.keys(nodeRequirements).forEach(key => {
    // })
    if (sSystemData === undefined) {
      setItems([]);
    } else {
      const newChecklistItems = makeCheckList(
        {
          nodeRequirements,
          systemData: sSystemData,
          nodeStorageLocation,
        },
        t,
      );
      setItems(newChecklistItems);
    }
  }, [nodeRequirements, sSystemData, nodeStorageLocation]);

  return (
    <div className={container}>
      {type !== 'modal' && (
        <div className={titleFont}>{t('NodeRequirements')}</div>
      )}
      <div className={descriptionFont}>
        {nodeRequirements?.description ? (
          nodeRequirements.description
        ) : (
          <>{t('nodeRequirementsDefaultDescription')}</>
        )}
      </div>
      {nodeRequirements?.documentationUrl && (
        <ExternalLink
          text={t('nodeRequirementsLearnMore')}
          url={nodeRequirements.documentationUrl}
        />
      )}
      {!nodeRequirements && t('nodeRequirementsUnavailable')}
      <div
        className={[
          checklistContainer,
          sItems.length === 0 ? 'loading' : '',
        ].join(' ')}
      >
        <Checklist items={sItems} />
      </div>
    </div>
  );
};

export default NodeRequirements;
