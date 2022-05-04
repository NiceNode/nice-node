import { MdDelete } from 'react-icons/md';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import Node, { DockerOptions, NodeId, NodeOptions } from '../main/node';
import electron from './electronGlobal';
import IconButton from './IconButton';
import { useGetNodesQuery } from './state/nodeService';
import AddNode from './AddNode/AddNode';
import DivButton from './DivButton';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { selectSelectedNode, updateSelectedNode } from './state/node';

const LeftSideBar = () => {
  const sSelectedNode = useAppSelector(selectSelectedNode);
  const qGetNodes = useGetNodesQuery(null, {
    pollingInterval: 10000,
  });
  const dispatch = useAppDispatch();

  // Default selected node to be the first node
  if (
    !sSelectedNode &&
    Array.isArray(qGetNodes?.data) &&
    qGetNodes.data.length > 0
  ) {
    dispatch(updateSelectedNode(qGetNodes.data[0]));
  }

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
            const isSelectedNode = sSelectedNode?.id === node.id;
            return (
              <DivButton
                key={node.id}
                style={{
                  border: isSelectedNode ? '3px solid' : '1px solid',
                  padding: 2,
                  borderRadius: 5,
                }}
                onClick={() => dispatch(updateSelectedNode(node))}
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
                  {/* <IconButton
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
                  </IconButton> */}
                  <span
                    className="colored-circle"
                    style={{ background: statusColor }}
                  />
                </div>
              </DivButton>
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
