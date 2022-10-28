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
}

const NodeRequirements = ({
  nodeRequirements,
  systemData,
  nodeStorageLocation,
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
  }, [nodeRequirements, systemData, nodeStorageLocation, t]);

  return (
    <div className={container}>
      <div className={titleFont}>Node Requirements</div>
      <div className={descriptionFont}>
        {nodeRequirements?.description ? (
          nodeRequirements.description
        ) : (
          <>
            Your computer is checked with the recommended requirements for the
            selected node.
          </>
        )}
      </div>
      {nodeRequirements?.documentationUrl && (
        <ExternalLink
          text="Learn more about the requirements"
          url={nodeRequirements.documentationUrl}
        />
      )}
      {!nodeRequirements && (
        <>
          The requirements are unavailable. Please check with the node provider.
        </>
      )}
      <Checklist items={sItems} />
    </div>
  );
};

export default NodeRequirements;
