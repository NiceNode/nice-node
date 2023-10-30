import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  container,
  descriptionFont,
  titleFont,
  checklistContainer,
} from './nodeRequirements.css';
import { SystemData } from '../../../main/systemInfo';
import { ChecklistItemProps } from '../../Generics/redesign/Checklist/ChecklistItem';
import { Checklist } from '../../Generics/redesign/Checklist/Checklist';
import { SystemRequirements } from '../../../common/systemRequirements';
import electron from '../../electronGlobal';
// eslint-disable-next-line import/no-cycle
import { makeCheckList } from './requirementsChecklistUtil';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';

export interface NodeRequirementsProps {
  /**
   * Node requirements
   */
  nodeRequirements?: SystemRequirements;
  /**
   * Title of the checklist
   */
  // eslint-disable-next-line react/no-unused-prop-types
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {!nodeRequirements && <>{t('nodeRequirementsUnavailable')}</>}
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
