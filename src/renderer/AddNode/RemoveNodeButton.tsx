import { useState } from 'react';

import { MdRemoveCircleOutline } from 'react-icons/md';
import ConfirmRemoveNode from './ConfirmRemoveNode';
import Node from '../../common/node';

const RemoveNodeButton = (props: { node: Node }) => {
  const [sIsModalOpenConfirmRemoveNode, setIsModalOpenConfirmRemoveNode] =
    useState<boolean>(false);

  const { node } = props;
  const onConfirmRemoveNode = () => {
    setIsModalOpenConfirmRemoveNode(false);
  };

  return (
    <>
      <button
        type="button"
        disabled={node === undefined}
        onClick={() => setIsModalOpenConfirmRemoveNode(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MdRemoveCircleOutline style={{ marginRight: 5 }} />
          Remove
        </div>
      </button>
      {node && (
        <ConfirmRemoveNode
          isOpen={sIsModalOpenConfirmRemoveNode}
          onConfirm={onConfirmRemoveNode}
          onCancel={() => setIsModalOpenConfirmRemoveNode(false)}
          node={node}
        />
      )}
    </>
  );
};
export default RemoveNodeButton;
