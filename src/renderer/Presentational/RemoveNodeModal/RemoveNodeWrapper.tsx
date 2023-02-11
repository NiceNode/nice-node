import { useEffect, useState } from 'react';
import { ModalConfig } from '../../Generics/redesign/Modal/ModalManager';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNode } from '../../state/node';
import RemoveNode from './RemoveNode';

export interface RemoveNodeWrapperProps {
  modalOnChangeConfig: (config: ModalConfig) => void;
}

const RemoveNodeWrapper = ({ modalOnChangeConfig }: RemoveNodeWrapperProps) => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const [sNodeStorageUsedGBs, setNodeStorageUsedGBs] = useState<number>();

  useEffect(() => {
    console.log(selectedNode);
    if (selectedNode?.runtime?.usage?.diskGBs) {
      const nodeStorageGBs = selectedNode?.runtime?.usage?.diskGBs;
      setNodeStorageUsedGBs(nodeStorageGBs);
    } else {
      setNodeStorageUsedGBs(undefined);
    }
    modalOnChangeConfig({ selectedNode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);

  return (
    <RemoveNode
      nodeStorageUsedGBs={sNodeStorageUsedGBs}
      modalOnChangeConfig={modalOnChangeConfig}
      selectedNode={selectedNode}
    />
  );
};

export default RemoveNodeWrapper;
