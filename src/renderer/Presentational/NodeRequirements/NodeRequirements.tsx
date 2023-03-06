import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { container, descriptionFont, titleFont } from './nodeRequirements.css';
import { SystemData } from '../../../main/systemInfo';
import { ChecklistItemProps } from '../../Generics/redesign/Checklist/ChecklistItem';
import { Checklist } from '../../Generics/redesign/Checklist/Checklist';
import { SystemRequirements } from '../../../common/systemRequirements';
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
  systemData?: SystemData;
  /**
   * A folder path where the node data will be stored.
   */
  nodeStorageLocation?: string;
  type?: string;
}

const NodeRequirements = ({
  nodeRequirements,
  systemData,
  nodeStorageLocation,
  type,
}: NodeRequirementsProps) => {
  const { t } = useTranslation('systemRequirements');
  const [sItems, setItems] = useState<ChecklistItemProps[]>([]);

  useEffect(() => {
    // determine checkList and status
    // for each node req, determine if systemData meets it
    // Object.keys(nodeRequirements).forEach(key => {
    // })
    console.log(
      'useEffect: nodeRequirements, systemData, t',
      nodeRequirements,
      systemData
    );
    const newChecklistItems = makeCheckList(
      {
        nodeRequirements,
        systemData,
        nodeStorageLocation,
      },
      t
    );
    setItems(newChecklistItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeRequirements, systemData, nodeStorageLocation]);

  return (
    <div className={container}>
      {type !== 'modal' && <div className={titleFont}>Node Requirements</div>}
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
      <Checklist items={sItems} />
    </div>
  );
};

export default NodeRequirements;
