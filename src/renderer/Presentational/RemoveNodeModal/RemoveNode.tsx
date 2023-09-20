import { useEffect, useState } from 'react';
import { NodePackage } from 'common/node';
import { ModalConfig } from '../ModalManager/modalUtils';
import { Checkbox } from '../../Generics/redesign/Checkbox/Checkbox';
import { container, removeText } from './removeNode.css';

export interface RemoveNodeProps {
  nodeStorageUsedGBs?: number;
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  selectedNodePackage?: NodePackage;
}

const RemoveNode = ({
  nodeStorageUsedGBs,
  modalOnChangeConfig,
  selectedNodePackage,
}: RemoveNodeProps) => {
  const [sNodeStorageMessage, setNodeStorageMessage] = useState<string>(
    '(calculating data size...)',
  );

  useEffect(() => {
    if (nodeStorageUsedGBs) {
      setNodeStorageMessage(`(${nodeStorageUsedGBs.toFixed(1)}GB)`);
    } else {
      setNodeStorageMessage('(calculating data size...)');
    }
  }, [nodeStorageUsedGBs]);

  return (
    <div className={container}>
      <p className={removeText}>
        All settings and data for this node will be removed from your computer.
      </p>
      <p className={removeText}>
        Optionally you can choose to keep the current chain data to shorten
        future sync times for NiceNode or alternative uses.
      </p>
      <Checkbox
        label={`Keep node related chain data ${sNodeStorageMessage}`}
        onClick={(isChecked: boolean) => {
          modalOnChangeConfig({
            isDeleteStorage: !isChecked,
            selectedNodePackage,
          });
        }}
      />
    </div>
  );
};

export default RemoveNode;
