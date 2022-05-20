// import { MdDelete } from 'react-icons/md';
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import Node, { NodeId, NodeStatus } from '../common/node';
import electron from './electronGlobal';
import InstallDocker from './InstallDocker';
// import { useGetNodesQuery } from './state/nodeService';
import { useAppDispatch, useAppSelector } from './state/hooks';
import {
  selectSelectedNode,
  selectSelectedNodeId,
  selectUserNodes,
  updateSelectedNodeId,
} from './state/node';
import { useGetIsDockerInstalledQuery } from './state/settingsService';

const NodeScreen = () => {
  const selectedNode = useAppSelector(selectSelectedNode);

  const qIsDockerInstalled = useGetIsDockerInstalledQuery();

  // const isDisabled = true;
  const isDockerInstalled = qIsDockerInstalled?.data;

  // Will select the Node with the given id, and will only rerender if the given Node data changes
  // https://redux-toolkit.js.org/rtk-query/usage/queries#selecting-data-from-a-query-result
  // const { selectedNode } = useGetNodesQuery(undefined, {
  //   selectFromResult: ({ data }: { data: Node[] }) => {
  //     return {
  //       selectedNode: data?.find((node) => node.id === sSelectedNodeId),
  //     };
  //   },
  // });
  if (!selectedNode) {
    // if docker is not installed, show prompt
    if (true | !isDockerInstalled) {
      return <InstallDocker />;
    }
    return <div>No node selected</div>;
  }

  const { status, spec } = selectedNode;
  const { category, displayName } = spec;

  // todo: modal with confirm & delete data warning,etc.
  const onClickRemoveNode = async (nodeId: NodeId) => {
    const node = await electron.removeNode(nodeId);
    console.log('removed node: ', node);
  };

  return (
    <div>
      {/* <div style={{ wordBreak: 'break-word' }}>
        {JSON.stringify(selectedNode, null, '\n')}
      </div> */}
      <div>
        <h2>{category} Node</h2>
        <h2>{displayName}</h2>
        <h3>Status: {status}</h3>
        {/* {status === 'running' && (
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
        )} */}
      </div>
      <div className="Hello">
        <button
          type="button"
          onClick={() => electron.startNode(selectedNode.id)}
          disabled={
            !(
              status === NodeStatus.created ||
              status === NodeStatus.readyToStart ||
              status === NodeStatus.errorStarting ||
              status === NodeStatus.errorRunning ||
              status === NodeStatus.stopped ||
              status === NodeStatus.errorStopping ||
              status === NodeStatus.unknown
            )
          }
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaPlayCircle style={{ marginRight: 5 }} />
            Start
          </div>
        </button>
        &nbsp;
        <button
          type="button"
          onClick={() => electron.stopNode(selectedNode.id)}
          disabled={status !== NodeStatus.running}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaPauseCircle style={{ marginRight: 5 }} />
            Stop
          </div>
        </button>
        &nbsp;
        <button
          type="button"
          onClick={() => onClickRemoveNode(selectedNode.id)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MdDelete style={{ marginRight: 5 }} />
            Remove
          </div>
        </button>
      </div>
    </div>
  );
};
export default NodeScreen;
