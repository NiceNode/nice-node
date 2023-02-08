import { useCallback, useEffect, useState } from 'react';
import electron from '../../electronGlobal';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNode } from '../../state/node';
import RemoveNode from './RemoveNode';

export type RemoveNodeAction = 'cancel' | 'remove';

export interface RemoveNodeWrapperProps {
  onClose: (action: RemoveNodeAction) => void;
}

const RemoveNodeWrapper = ({ onClose }: RemoveNodeWrapperProps) => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const [sNodeStorageUsedGBs, setNodeStorageUsedGBs] = useState<number>();
  const [sError, setError] = useState<string>('');

  useEffect(() => {
    console.log(selectedNode);
    if (selectedNode?.runtime?.usage?.diskGBs) {
      const nodeStorageGBs = selectedNode?.runtime?.usage?.diskGBs;
      setNodeStorageUsedGBs(nodeStorageGBs);
    } else {
      setNodeStorageUsedGBs(undefined);
    }
  }, [selectedNode]);

  const onClickRemoveNode = useCallback(
    async (isDeletingData: boolean) => {
      // open remove node modal/prompt
      console.log('onClickRemoveNode', selectedNode?.id, isDeletingData);
      if (!selectedNode) {
        throw new Error(
          'Unable to remove the node. No selected node detected.'
        );
      }
      try {
        setError('');
        await electron.removeNode(selectedNode.id, {
          isDeleteStorage: isDeletingData,
        });
        // unselect the current node?
        // or call remove node through a hook which updates this?
        onClose('remove');
      } catch (err) {
        console.error(err);
        setError(
          'There was an error removing the node. Try again and please report the error to the NiceNode team in Discord.'
        );
      }
    },
    [selectedNode, onClose]
  );

  return (
    <RemoveNode
      nodeStorageUsedGBs={sNodeStorageUsedGBs}
      onClickClose={() => onClose('cancel')}
      onClickRemoveNode={onClickRemoveNode}
      errorMessage={sError}
    />
  );
};

export default RemoveNodeWrapper;
