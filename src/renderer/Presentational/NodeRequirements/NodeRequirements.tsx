import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { container } from './nodeRequirements.css';
import { SystemData } from '../../../main/systemInfo';
import { ChecklistItemProps } from '../../Generics/redesign/Checklist/ChecklistItem';
import { Checklist } from '../../Generics/redesign/Checklist/Checklist';
import { SystemRequirements } from '../../../common/systemRequirements';
// eslint-disable-next-line import/no-cycle
import { makeCheckList } from './requirementsChecklistUtil';

export interface NodeRequirementsProps {
  /**
   * Node requirements
   */
  nodeRequirements: SystemRequirements;
  /**
   * Title of the checklist
   */
  systemData: SystemData;
}

/**
 * Primary UI component for user interaction
 */
const NodeRequirements = ({
  nodeRequirements,
  systemData,
}: NodeRequirementsProps) => {
  const { t } = useTranslation('systemRequirements');
  const [sItems, setItems] = useState<ChecklistItemProps[]>([]);

  useEffect(() => {
    // determine checkList and status
    // for each node req, determine if systemData meets it
    // Object.keys(nodeRequirements).forEach(key => {
    // })
    const newChecklistItems = makeCheckList(
      {
        nodeRequirements,
        systemData,
      },
      t
    );
    setItems(newChecklistItems);
  }, [nodeRequirements, systemData, t]);

  return (
    <div className={container}>
      <Checklist title="Node requirements" items={sItems} />
    </div>
  );
};

export default NodeRequirements;
