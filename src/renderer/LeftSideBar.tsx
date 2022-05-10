import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';

import Node from '../common/node';
import { useGetNodesQuery } from './state/nodeService';
import AddNode from './AddNode/AddNode';
import DivButton from './DivButton';
import { useAppDispatch, useAppSelector } from './state/hooks';
import { selectSelectedNodeId, updateSelectedNodeId } from './state/node';

const LeftSideBar = () => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const qGetNodes = useGetNodesQuery(null, {
    pollingInterval: 0,
  });
  const dispatch = useAppDispatch();

  // Default selected node to be the first node
  useEffect(() => {
    if (
      !sSelectedNodeId &&
      Array.isArray(qGetNodes?.data) &&
      qGetNodes.data.length > 0
    ) {
      dispatch(updateSelectedNodeId(qGetNodes.data[0].id));
    }
  }, [sSelectedNodeId, qGetNodes, dispatch]);

  useEffect(() => {
    console.log('LSB: new qGetNodes', qGetNodes);
    if (qGetNodes.data) {
      console.log('LSB: new qGetNodes.data', qGetNodes.data);
    }
  }, [qGetNodes]);

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
            const isSelectedNode = sSelectedNodeId === node.id;
            return (
              <DivButton
                key={node.id}
                style={{
                  border: isSelectedNode ? '3px solid' : '1px solid',
                  padding: 2,
                  borderRadius: 5,
                }}
                onClick={() => dispatch(updateSelectedNodeId(node.id))}
              >
                <img
                  src={node.spec.iconUrl}
                  alt={node.spec.displayName}
                  style={{ width: 50 }}
                />
                <span style={{ textOverflow: 'ellipsis' }}>
                  {node.spec.displayName}
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
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
