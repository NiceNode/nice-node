import { MdDelete } from 'react-icons/md';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import Node, {
  DockerOptions,
  NodeId,
  NodeOptions,
  NodeStatus,
} from '../main/node';
import electron from './electronGlobal';
import IconButton from './IconButton';
import { useGetNodesQuery } from './state/nodeService';
import AddNode from './AddNode/AddNode';
import DivButton from './DivButton';
import { useAppSelector } from './state/hooks';
import { selectSelectedNode } from './state/node';

const NodeScreen = () => {
  const sSelectedNode = useAppSelector(selectSelectedNode);
  if (!sSelectedNode) {
    return <div>No node selected</div>;
  }
  const { displayName, status, category } = sSelectedNode;

  return (
    <div>
      <div style={{ wordBreak: 'break-word' }}>
        {JSON.stringify(sSelectedNode, null, '\n')}
      </div>
      <div>
        <h2>{category} Node</h2>
        <h2>{displayName}</h2>
        <h3>Status: {status}</h3>
        {status === 'running' && (
          <>
            <h4 data-tip data-for="nodeInfo">
              {detectExecutionClient(sNodeInfo, true)}
            </h4>
            <ReactTooltip
              place="bottom"
              type="light"
              effect="solid"
              id="nodeInfo"
            >
              <span style={{ fontSize: 16 }}>{sNodeInfo}</span>
            </ReactTooltip>
          </>
        )}
      </div>
      <div className="Hello">
        <button
          type="button"
          onClick={() => electron.startNode(sSelectedNode.id)}
          disabled={
            !(
              status === NodeStatus.created ||
              status === NodeStatus.readyToStart ||
              status === NodeStatus.stopped ||
              status === NodeStatus.errorStopping
            )
          }
        >
          <span>Start</span>
        </button>
        &nbsp;
        <button
          type="button"
          onClick={() => electron.stopNode(sSelectedNode.id)}
          disabled={status !== NodeStatus.running}
        >
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
};
export default NodeScreen;
