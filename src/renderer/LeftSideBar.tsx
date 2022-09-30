import { useEffect } from 'react';

import { NodeId } from '../common/node';
import AddNode from './AddNode/AddNodeRedesign';
import DivButton from './DivButton';
import { useAppDispatch, useAppSelector } from './state/hooks';
import {
  selectSelectedNodeId,
  selectUserNodes,
  updateSelectedNodeId,
} from './state/node';

export const LEFT_SIDEBAR_WIDTH = 120;

const LeftSideBar = () => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const sUserNodes = useAppSelector(selectUserNodes);
  const dispatch = useAppDispatch();

  // Default selected node to be the first node
  useEffect(() => {
    if (
      !sSelectedNodeId &&
      sUserNodes &&
      Array.isArray(sUserNodes?.nodeIds) &&
      sUserNodes.nodeIds.length > 0
    ) {
      dispatch(updateSelectedNodeId(sUserNodes.nodeIds[0]));
    }
  }, [sSelectedNodeId, sUserNodes, dispatch]);

  return (
    <div
      style={{
        width: LEFT_SIDEBAR_WIDTH,
        // borderRight: '1px solid grey',
      }}
    >
      <div
        style={{
          paddingLeft: 10,
          paddingTop: 30,
        }}
      >
        <AddNode />
        {/* {qGetNodes.error && <>Oh no, there was an error getting nodes</>}
      {qGetNodes.isLoading && <>Loading nodes...</>} */}
        {sUserNodes?.nodeIds ? (
          <>
            {sUserNodes.nodeIds.map((nodeId: NodeId) => {
              const node = sUserNodes.nodes[nodeId];
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
                    border: isSelectedNode
                      ? '3px solid'
                      : '1px solid lightgrey',
                    padding: 2,
                    borderRadius: 5,
                    marginBottom: 10,
                    width: 100,
                    height: 100,
                  }}
                  onClick={() => dispatch(updateSelectedNodeId(node.id))}
                >
                  <div style={{ width: 90, height: 50 }}>
                    <img
                      src={node.spec.iconUrl}
                      alt={node.spec.displayName}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>

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
          <>No nodes {JSON.stringify(sUserNodes)}</>
        )}
      </div>
    </div>
  );
};
export default LeftSideBar;
