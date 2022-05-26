import { useState } from 'react';

import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';
import DynamicNodeConfig from './DynamicNodeConfig';
import { useAppSelector } from '../state/hooks';
import { selectSelectedNode } from '../state/node';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
};

const DynamicSettings = ({ isOpen, onClickCloseButton }: Props) => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const [sDeleteNodeStorageResult, setDeleteNodeStorageResult] =
    useState<boolean>();

  let title = 'Settings';
  if (selectedNode) {
    title = `${selectedNode.spec.displayName} settings`;
  }
  return (
    <MenuDrawer
      title={title}
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      <DynamicNodeConfig />
      <h2>Storage</h2>
      <div>
        <h3>Delete node data</h3>
        <p>
          Your node requires this data to run and will require time and internet
          data to recover if deleted. Only delete node data if you do not intend
          to run this node.
        </p>
        {/* todo fix: This deletes the entire node.runtime.dataDir.. hmm */}
        <button
          type="button"
          disabled={selectedNode === undefined}
          onClick={async () => {
            console.log('Deleting node storage...');
            // clear result while waiting for delete to return
            setDeleteNodeStorageResult(undefined);
            if (selectedNode?.id) {
              setDeleteNodeStorageResult(
                await electron.deleteNodeStorage(selectedNode?.id)
              );
            } else {
              console.error('Unable to delete storage. No selected node.');
            }
          }}
          style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
        >
          <span>Delete</span>
        </button>
        {sDeleteNodeStorageResult !== undefined && (
          <>
            {sDeleteNodeStorageResult ? (
              <span>Delete successful</span>
            ) : (
              <span>Delete failed</span>
            )}
          </>
        )}
      </div>
    </MenuDrawer>
  );
};
export default DynamicSettings;
