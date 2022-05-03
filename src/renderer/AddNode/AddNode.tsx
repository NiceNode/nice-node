import { BsPlusSquareDotted } from 'react-icons/bs';
import { useEffect, useState } from 'react';

import Node, { DockerOptions, NodeId, NodeOptions } from '../../main/node';
import electron from '../electronGlobal';
import IconButton from '../IconButton';
import { Modal } from '../Modal';
import NodeCard from './NodeCard';

const AddNode = () => {
  const [sIsModalOpenAddNode, setIsModalOpenAddNode] = useState<boolean>(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sExecutionClientLibrary] = useState<any>([
    {
      displayName: 'Nethermind',
      imageName: 'nethermind/nethermind',
      category: 'L1/ExecutionClient',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/nethermind-logo.png',
    },
    {
      displayName: 'Erigon',
      imageName: 'thorax/erigon:latest',
      category: 'L1/ExecutionClient',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/erigon-text-logo.png',
    },
    {
      displayName: 'Besu',
      imageName: 'nethermind/nethermind',
      category: 'L1/ExecutionClient',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/besu-text-logo.png',
    },
    {
      displayName: 'Geth',
      imageName: 'ethereum/client-go:stable',
      category: 'L1/ExecutionClient',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/geth-logo.png',
    },
  ]);
  const [sBeaconNodeLibrary] = useState<any>([
    {
      displayName: 'Lodestar',
      imageName: 'gcr.io/prysmaticlabs/prysm/beacon-chain:stable',
      category: 'L1/ConsensusClient/BeaconNode',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/lodestar-logo-text.png',
    },
    {
      displayName: 'Teku',
      imageName: 'sigp/lighthouse',
      category: 'L1/ConsensusClient/BeaconNode',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/teku-logo.png',
    },
    {
      displayName: 'Nimbus',
      imageName: 'sigp/lighthouse',
      category: 'L1/ConsensusClient/BeaconNode',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/nimbus-logo-text.png',
    },
    {
      displayName: 'Lighthouse',
      imageName: 'sigp/lighthouse',
      category: 'L1/ConsensusClient/BeaconNode',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/lighthouse-logo.png',
    },
    {
      displayName: 'Prysm',
      imageName: 'gcr.io/prysmaticlabs/prysm/beacon-chain:stable',
      category: 'L1/ConsensusClient/BeaconNode',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/prysm-logo.png',
    },
  ]);
  const [sLayer2ClientLibrary] = useState<any>([
    {
      displayName: 'Nethermind',
      imageName: 'nethermind/nethermind',
      category: 'L1/ExecutionClient',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/nethermind-logo.png',
    },
    {
      displayName: 'Erigon',
      imageName: 'thorax/erigon:latest',
      category: 'L1/ExecutionClient',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/erigon-text-logo.png',
    },
    {
      displayName: 'Besu',
      imageName: 'nethermind/nethermind',
      category: 'L1/ExecutionClient',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/besu-text-logo.png',
    },
    {
      displayName: 'StarkNet, Pathfinder',
      imageName: 'eqlabs/pathfinder:latest',
      category: 'L2/StarkNet',
      executionType: 'docker',
      runInBackground: true,
      iconUrl:
        'https://equilibrium.co/_next/image?url=%2Fimages%2Fcasestudies%2Fsquare-pathfinder.png&w=640&q=75',
    },
  ]);
  const onClickAddNodeButton = async () => {
    setIsModalOpenAddNode(true);
  };
  const onConfirmAddSpecificNode = async (nodeOptions: NodeOptions) => {
    const node = await electron.addNode(nodeOptions);
    console.log('addNode returned node: ', node);
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {sExecutionClientLibrary.map((nodeOptions: NodeOptions) => {
                return <NodeCard nodeOptions={nodeOptions} />;
              })}
            </div>
          ) : (
            <span>Unable to load node library</span>
          )}
        </div>
        <div>
          <h2>Ethereum Beacon Node (Consensus client)</h2>
          {sBeaconNodeLibrary ? (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {sBeaconNodeLibrary.map((nodeOptions: NodeOptions) => {
                return <NodeCard nodeOptions={nodeOptions} />;
              })}
            </div>
          ) : (
            <span>Unable to load beacon node library</span>
          )}
        </div>
      </Modal>
    </div>
  );
};
export default AddNode;
