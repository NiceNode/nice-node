import { useEffect, useState } from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNodePackage } from '../../state/node';
import type { ModalConfig } from '../ModalManager/modalUtils';
import RemoveNode from './RemoveNode';

export interface RemoveNodeWrapperProps {
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
}

const RemoveNodeWrapper = ({ modalOnChangeConfig }: RemoveNodeWrapperProps) => {
  const selectedNodePackage = useAppSelector(selectSelectedNodePackage);
  const [sNodeStorageUsedGBs, setNodeStorageUsedGBs] = useState<number>();

  useEffect(() => {
    console.log(selectSelectedNodePackage);
    if (selectedNodePackage?.runtime?.usage?.diskGBs) {
      const nodeStorageGBs = selectedNodePackage?.runtime?.usage?.diskGBs[0]?.y;
      setNodeStorageUsedGBs(nodeStorageGBs);
    } else {
      setNodeStorageUsedGBs(undefined);
    }
    modalOnChangeConfig({ selectedNodePackage });
  }, [selectedNodePackage]);

  return (
    <RemoveNode
      nodeStorageUsedGBs={sNodeStorageUsedGBs}
      modalOnChangeConfig={modalOnChangeConfig}
      selectedNodePackage={selectedNodePackage}
    />
  );
};

export default RemoveNodeWrapper;
