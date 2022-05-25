import { BsPlusSquareDotted } from 'react-icons/bs';
import { useEffect, useState } from 'react';

import IconButton from '../IconButton';
import { Modal } from '../Modal';
import NodeCard from './NodeCard';
import ConfirmAddNode from './ConfirmAddNode';
import { NodeSpecification } from '../../common/nodeSpec';
import DivButton, { DopeButton } from '../DivButton';
import { NodeLibrary } from '../../main/state/nodeLibrary';
import electron from '../electronGlobal';

const categorizeNodeLibrary = (
  nodeLibrary: NodeLibrary
): {
  ExecutionClient: NodeSpecification[];
  BeaconNode: NodeSpecification[];
  L2: NodeSpecification[];
  Other: NodeSpecification[];
} => {
  const ec: NodeSpecification[] = [];
  const bn: NodeSpecification[] = [];
  const l2: NodeSpecification[] = [];
  const other: NodeSpecification[] = [];

  const catgorized = {
    ExecutionClient: ec,
    BeaconNode: bn,
    L2: l2,
    Other: other,
  };
  Object.keys(nodeLibrary).forEach((specId) => {
    const nodeSpec = nodeLibrary[specId];
    if (nodeSpec.category === 'L1/ExecutionClient') {
      catgorized.ExecutionClient.push(nodeSpec);
    } else if (nodeSpec.category === 'L1/ConsensusClient/BeaconNode') {
      catgorized.BeaconNode.push(nodeSpec);
    } else if (nodeSpec.category?.includes('L2')) {
      catgorized.L2.push(nodeSpec);
    } else {
      catgorized.Other.push(nodeSpec);
    }
  });
  return catgorized;
};

const AddNode = () => {
  const [sIsModalOpenAddNode, setIsModalOpenAddNode] = useState<boolean>(true);
  const [sIsModalOpenConfirmAddNode, setIsModalOpenConfirmAddNode] =
    useState<boolean>(false);
  const [sSelectedNodeSpecification, setSelectedNodeSpecification] =
    useState<NodeSpecification>();
  const [sNodeLibrary, setNodeLibrary] = useState<NodeLibrary>({});
  const [sExecutionClientLibrary, setExecutionClientLibrary] = useState<
    NodeSpecification[]
  >([]);
  const [sBeaconNodeLibrary, setBeaconNodeLibrary] = useState<
    NodeSpecification[]
  >([]);
  const [sLayer2ClientLibrary, setLayer2ClientLibrary] = useState<
    NodeSpecification[]
  >([]);
  const [sOtherNodeLibrary, setOtherNodeLibrary] = useState<
    NodeSpecification[]
  >([]);

  useEffect(() => {
    const fetchNodeLibrary = async () => {
      const nodeLibrary = await electron.getNodeLibrary();
      console.log('nodeLibrary', nodeLibrary);
      const categorized = categorizeNodeLibrary(nodeLibrary);
      console.log('nodeLibrary categorized', categorized);
      setExecutionClientLibrary(categorized.ExecutionClient);
      setBeaconNodeLibrary(categorized.BeaconNode);
      setLayer2ClientLibrary(categorized.L2);
      setOtherNodeLibrary(categorized.Other);
      // set exec, beacons, and layer 2s
    };
    fetchNodeLibrary();
  }, []);

  const onNodeSelected = (nodeSpec: NodeSpecification) => {
    // set selected node
    setSelectedNodeSpecification(nodeSpec);
    // open confirm add modal
    setIsModalOpenConfirmAddNode(true);
  };

  const onConfirmAddNode = () => {
    // close both modals
    setIsModalOpenConfirmAddNode(false);
    setIsModalOpenAddNode(false);
  };

  const onClickAddNodeButton = async () => {
    setIsModalOpenAddNode(true);
  };

  return (
    <div>
      <span>Add node</span>
      <IconButton type="button" onClick={onClickAddNodeButton}>
        <BsPlusSquareDotted />
      </IconButton>

      <Modal
        isOpen={sIsModalOpenAddNode}
        title="Add Node"
        onClickCloseButton={() => setIsModalOpenAddNode(false)}
      >
        <div>
          <h2>Ethereum Node (Execution client)</h2>

          {sExecutionClientLibrary ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <DopeButton
                onClick={() =>
                  onNodeSelected(
                    Math.floor(Math.random() * 2) === 0 ? 'besu' : 'nethermind'
                  )
                }
              >
                <span style={{ fontSize: '1.5em', color: 'white' }}>
                  Minority Client
                </span>
              </DopeButton>
              {sExecutionClientLibrary.map((nodeSpec: NodeSpecification) => {
                return (
                  <NodeCard
                    key={nodeSpec.displayName}
                    nodeSpec={nodeSpec}
                    onSelected={() => onNodeSelected(nodeSpec)}
                  />
                );
              })}
            </div>
          ) : (
            <span>Unable to load node library</span>
          )}
        </div>
        <div>
          <h2>Ethereum Beacon Node (Consensus client)</h2>
          {sBeaconNodeLibrary ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <DopeButton
              // onClick={() => dispatch(updateSelectedNodeId(node.id))}
              >
                <span style={{ fontSize: '1.5em', color: 'white' }}>
                  Minority Client
                </span>
              </DopeButton>
              {sBeaconNodeLibrary.map((nodeSpec: NodeSpecification) => {
                return (
                  <NodeCard
                    key={nodeSpec.displayName}
                    nodeSpec={nodeSpec}
                    onSelected={() => onNodeSelected(nodeSpec)}
                  />
                );
              })}
            </div>
          ) : (
            <span>Unable to load beacon node library</span>
          )}
        </div>
        <div>
          <h2>Ethereum Layer 2</h2>
          {sLayer2ClientLibrary ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {sLayer2ClientLibrary.map((nodeSpec: NodeSpecification) => {
                return (
                  <NodeCard
                    key={nodeSpec.displayName}
                    nodeSpec={nodeSpec}
                    onSelected={() => onNodeSelected(nodeSpec)}
                  />
                );
              })}
            </div>
          ) : (
            <span>Unable to load layer 2 node library</span>
          )}
        </div>
        {sOtherNodeLibrary.length > 0 && (
          <div>
            <h2>Other</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {sOtherNodeLibrary.map((nodeSpec: NodeSpecification) => {
                return (
                  <NodeCard
                    key={nodeSpec.displayName}
                    nodeSpec={nodeSpec}
                    onSelected={() => onNodeSelected(nodeSpec)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmAddNode
        isOpen={sIsModalOpenConfirmAddNode}
        onConfirm={onConfirmAddNode}
        onCancel={() => setIsModalOpenConfirmAddNode(false)}
        nodeSpec={sSelectedNodeSpecification}
      />
    </div>
  );
};
export default AddNode;

/**
 * geth binary format
 *const baseURL = 'https://gethstore.blob.core.windows.net/builds/';
const macOS = 'geth-darwin-amd64-1.10.17-25c9b49f';
const windows32bit = 'geth-windows-386-1.10.17-25c9b49f';
const windows64bit = 'geth-windows-amd64-1.10.17-25c9b49f';
const linux32bit = 'geth-linux-386-1.10.17-25c9b49f';
const linux64bit = 'geth-linux-amd64-1.10.17-25c9b49f';
const linuxArm64 = 'geth-linux-arm64-1.10.17-25c9b49f';
const linuxArm32v7 = 'geth-linux-arm7-1.10.17-25c9b49f';
 *
 *
 * lighthouse binary downloads
 *https://github.com/sigp/lighthouse/releases/download/v2.2.1/lighthouse-v2.2.1-x86_64-apple-darwin.tar.gz
 *
 *
 * a way to fetch the latest version... and string format to plug in version, platform, arch
 */
