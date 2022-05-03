import { BsPlusSquareDotted } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import Node, { DockerOptions, NodeId, NodeOptions } from '../main/node';
import electron from './electronGlobal';
import IconButton from './IconButton';
import { useGetNodesQuery } from './state/nodeService';
import AddNodeModal from './AddNode/AddNode';
import AddNode from './AddNode/AddNode';

const LeftSideBar = () => {
  const qGetNodes = useGetNodesQuery(null, {
    pollingInterval: 10000,
  });

  // todo: modal with confirm & delete data warning,etc.
  const onClickRemoveNode = async (nodeId: NodeId) => {
    const node = await electron.removeNode(nodeId);
    console.log('removed node: ', node);
    qGetNodes.refetch();
  };

  return (
    <div
      style={{
        width: 100,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
      }}
    >
      <AddNode />
      {qGetNodes.error && <>Oh no, there was an error getting nodes</>}
      {qGetNodes.isLoading && <>Loading nodes...</>}
      {qGetNodes.data ? (
        <>
          {qGetNodes.data.map((node: Node) => {
            let statusColor = node.status === 'running' ? 'green' : 'black';
            if (node.status.includes('error')) {
              statusColor = 'red';
            } else if (node.status.includes('stopped')) {
              statusColor = 'grey';
            }
            return (
              <div
                key={node.id}
                style={{ border: '1px solid', padding: 2, borderRadius: 5 }}
              >
                <img
                  src={node.iconUrl}
                  alt={node.displayName}
                  style={{ width: 50 }}
                />
                <span style={{ textOverflow: 'ellipsis' }}>
                  {node.displayName}
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <IconButton
                    type="button"
                    onClick={() => electron.startNode(node.id)}
                    style={{ padding: 2 }}
                  >
                    <FaPlayCircle />
                  </IconButton>
                  <IconButton
                    type="button"
                    onClick={() => electron.stopNode(node.id)}
                    style={{ padding: 2 }}
                  >
                    <FaPauseCircle />
                  </IconButton>
                  <IconButton
                    type="button"
                    onClick={() => onClickRemoveNode(node.id)}
                    style={{ padding: 2 }}
                  >
                    <MdDelete />
                  </IconButton>
                  <span
                    className="colored-circle"
                    style={{ background: statusColor }}
                  />
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>nullnull</>
      )}
    </div>
  );
};
export default LeftSideBar;
