import { BsPlusSquareDotted } from 'react-icons/bs';
import { useEffect, useState } from 'react';

import Node, { DockerOptions, NodeId, NodeOptions } from '../../main/node';
import electron from '../electronGlobal';
import DivButton from '../DivButton';
import { Modal } from '../Modal';

const NodeCard = (props: { nodeOptions: NodeOptions }) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { displayName, iconUrl, category, executionType } = props.nodeOptions;
  return (
    <DivButton
      key={displayName}
      style={{
        border: '1px solid',
        padding: 2,
        borderRadius: 5,
        width: 100,
        height: 100,
        marginLeft: 5,
        marginRight: 10,
      }}
    >
      <div
        style={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={iconUrl}
          alt={displayName}
          style={{ maxWidth: '100%', maxHeight: 50 }}
        />
      </div>
      <div
        style={{
          height: 50,
        }}
      >
        <span style={{ textOverflow: 'ellipsis' }}>{displayName}</span>
      </div>
    </DivButton>
  );
};
export default NodeCard;
