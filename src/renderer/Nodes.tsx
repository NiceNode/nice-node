/* eslint-disable no-nested-ternary */
import Node, { DockerOptions, NodeId, NodeOptions } from '../main/node';
// import { useEffect, useState } from 'react';
import electron from './electronGlobal';
import { useGetNodesQuery } from './state/nodeService';

const Nodes = () => {
  const qGetNodes = useGetNodesQuery();
  // useEffect(() => {
  //   getNiceNodeVersion();
  // }, []);

  const onClickAddNode = async () => {
    // todo: let user select the node type/config
    const nodeOptions: DockerOptions = {
      displayName: 'Lighthouse Beacon Node',
      imageName: 'sigp/lighthouse',
      executionType: 'docker',
      runInBackground: true,
      iconUrl: 'https://i.imgur.com/iEywqSx.png',
    };
    const node = await electron.addNode(nodeOptions);
    qGetNodes.refetch();
    console.log('NODEEEEEEEE', node);
  };

  // todo: modal with confirm & delete data warning,etc.
  const onClickRemoveNode = async (nodeId: NodeId) => {
    const node = await electron.removeNode(nodeId);
    console.log('removed node: ', node);
    qGetNodes.refetch();
  };

  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <button type="button" onClick={onClickAddNode}>
        <span>Add Node</span>
      </button>
      {qGetNodes.error && <>Oh no, there was an error getting nodes</>}
      {qGetNodes.isLoading && <>Loading nodes...</>}
      {qGetNodes.data ? (
        <>
          {qGetNodes.data.map((node: Node) => {
            return (
              <div key={node.id}>
                <img src={node.iconUrl} alt={node.displayName} />
                <button
                  type="button"
                  onClick={() => onClickRemoveNode(node.id)}
                >
                  <span>Remove {node.displayName}</span>
                </button>
                <button
                  type="button"
                  onClick={() => electron.startNode(node.id)}
                >
                  <span>start {node.displayName}</span>
                </button>
                <button
                  type="button"
                  onClick={() => electron.stopNode(node.id)}
                >
                  <span>stop {node.displayName}</span>
                </button>
              </div>
            );
          })}
          <h3>{JSON.stringify(qGetNodes.data)}</h3>
        </>
      ) : (
        <>nullnull</>
      )}
    </div>
  );
};
export default Nodes;
