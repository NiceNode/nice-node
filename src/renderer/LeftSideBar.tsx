import { BsPlusSquareDotted } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import Node, { DockerOptions, NodeId, NodeOptions } from '../main/node';
import electron from './electronGlobal';
import IconButton from './IconButton';
import { useGetNodesQuery } from './state/nodeService';

const LeftSideBar = () => {
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

  useEffect(() => {}, []);

  return (
    <div
      style={{
        width: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 30,
      }}
    >
      <span>Add node</span>
      <IconButton type="button" onClick={onClickAddNode}>
        <BsPlusSquareDotted />
      </IconButton>
      {qGetNodes.error && <>Oh no, there was an error getting nodes</>}
      {qGetNodes.isLoading && <>Loading nodes...</>}
      {qGetNodes.data ? (
        <>
          {qGetNodes.data.map((node: Node) => {
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
