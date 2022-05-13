import { BsPlusSquareDotted } from 'react-icons/bs';
import { useState } from 'react';

import IconButton from '../IconButton';
import { Modal } from '../Modal';
import NodeCard from './NodeCard';
import ConfirmAddNode from './ConfirmAddNode';
import { NodeSpecification } from '../../common/nodeSpec';

const AddNode = () => {
  const [sIsModalOpenAddNode, setIsModalOpenAddNode] = useState<boolean>(false);
  const [sIsModalOpenConfirmAddNode, setIsModalOpenConfirmAddNode] =
    useState<boolean>(false);
  const [sSelectedNodeSpecification, setSelectedNodeSpecification] =
    useState<NodeSpecification>();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sExecutionClientLibrary] = useState<NodeSpecification[]>([
    {
      specId: 'nethermind',
      displayName: 'Nethermind',
      execution: {
        executionTypes: ['docker', 'binary'],
        defaultExecutionType: 'binary',
        input: {
          default: ['--JsonRpc.Enabled', 'true', '--datadir', 'data'],
          docker: {
            containerVolumePath: '/nethermind/data',
            raw: '--network host',
          },
        },
        architectures: {
          docker: ['amd64', 'arm64'],
          binary: ['amd64', 'arm64'],
        },
        imageName: 'nethermind/nethermind',
        binaryDownload: {
          // type: 'static',
          // linux: {
          //   amd64:
          //     'https://nethdev.blob.core.windows.net/builds/nethermind-linux-amd64-1.13.0-2e8910b.zip',
          // },
          type: 'githubReleases',
          latestVersionUrl:
            'https://api.github.com/repos/NethermindEth/nethermind/releases/latest',
          excludeNameWith: 'portable',
          responseFormat: 'githubReleases', // assets[i].name contains platform and arch
        },
      },
      category: 'L1/ExecutionClient',
      rpcTranslation: 'eth-l1',
      documentation: {
        default: 'https://docs.nethermind.io/nethermind/',
        docker: 'https://docs.nethermind.io/nethermind/ethereum-client/docker',
      },
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/nethermind-logo.png',
    },
    {
      specId: 'erigon',
      displayName: 'Erigon',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        imageName: 'thorax/erigon:latest',
      },
      category: 'L1/ExecutionClient',
      rpcTranslation: 'eth-l1',
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/erigon-text-logo.png',
    },
    {
      specId: 'besu',
      displayName: 'Besu',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        imageName: 'nethermind/nethermind',
      },
      category: 'L1/ExecutionClient',
      rpcTranslation: 'eth-l1',
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/besu-text-logo.png',
    },
    {
      specId: 'geth',
      displayName: 'Geth',
      execution: {
        executionTypes: ['binary'],
        defaultExecutionType: 'binary',
        execPath: 'geth',
        input: {
          default: [
            '-http',
            '--http.corsdomain',
            'nice-node://,http://localhost',
          ],
          // binary: {
          //   dataDirFlag: '--datadir',
          // },
        },
        binaryDownload: {
          type: 'static',
          darwin: {
            amd64:
              'https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.17-25c9b49f.tar.gz',
          },
          linux: {
            amd64:
              'https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.17-25c9b49f.tar.gz',
            amd32:
              'https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.10.17-25c9b49f.tar.gz',
            arm64:
              'https://gethstore.blob.core.windows.net/builds/geth-linux-arm64-1.10.17-25c9b49f.tar.gz',
            arm7: 'https://gethstore.blob.core.windows.net/builds/geth-linux-arm7-1.10.17-25c9b49f.tar.gz',
          },
          windows: {
            amd64:
              'https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.10.17-25c9b49f.zip',
            amd32:
              'https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.10.17-25c9b49f.zip',
          },
        },
      },
      category: 'L1/ExecutionClient',
      rpcTranslation: 'eth-l1',
      iconUrl:
        'https://clientdiversity.org/assets/img/execution-clients/geth-logo.png',
    },
  ]);
  const [sBeaconNodeLibrary] = useState<NodeSpecification[]>([
    {
      specId: 'lodestar-beacon',
      displayName: 'Lodestar',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        imageName: 'chainsafe/lodestar:latest',
      },
      category: 'L1/ConsensusClient/BeaconNode',
      rpcTranslation: 'eth-l2-beacon',
      documentation: {
        default: 'https://chainsafe.github.io/lodestar/',
        docker:
          'https://chainsafe.github.io/lodestar/installation/#install-with-docker',
      },
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/lodestar-logo-text.png',
    },
    {
      specId: 'teku-beacon',
      displayName: 'Teku',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        imageName: 'consensys/teku:latest',
      },
      category: 'L1/ConsensusClient/BeaconNode',
      rpcTranslation: 'eth-l2-beacon',
      documentation: {
        default: 'https://docs.teku.consensys.net/en/latest/',
        docker:
          'https://docs.teku.consensys.net/en/latest/HowTo/Get-Started/Installation-Options/Run-Docker-Image/',
      },
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/teku-logo.png',
    },
    {
      specId: 'nimbus-beacon',
      displayName: 'Nimbus',
      execution: {
        executionTypes: ['docker', 'binary'],
        defaultExecutionType: 'binary',
        imageName: 'statusim/nimbus-eth2:multiarch-latest',
        binaryDownload: {
          type: 'githubReleases',
          latestVersionUrl:
            'https://api.github.com/repos/status-im/nimbus-eth2/releases/latest',
          responseFormat: 'githubReleases', // assets[i].name contains platform and arch
        },
      },
      category: 'L1/ConsensusClient/BeaconNode',
      rpcTranslation: 'eth-l2-beacon',
      documentation: {
        default: 'https://nimbus.guide/',
        docker: 'https://nimbus.guide/docker.html',
      },
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/nimbus-logo-text.png',
    },
    {
      specId: 'lighthouse-beacon',
      displayName: 'Lighthouse',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        input: {
          default: [
            'lighthouse',
            '--network',
            'mainnet',
            'beacon',
            '--http',
            '--http-address',
            '0.0.0.0',
            '--http-allow-origin',
            '"*"',
          ],
          docker: {
            // pref host path /home/johns/.lighthouse
            containerVolumePath: '/root/.lighthouse',
            raw: '-d -p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052',
          },
        },
        architectures: {
          docker: ['amd64', 'arm64'],
        },
        imageName: 'sigp/lighthouse:latest-modern',
      },
      category: 'L1/ConsensusClient/BeaconNode',
      rpcTranslation: 'eth-l2-beacon',
      documentation: {
        default: 'https://lighthouse-book.sigmaprime.io/intro.html',
        docker: 'https://lighthouse-book.sigmaprime.io/docker.html',
      },
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/lighthouse-logo.png',
    },
    {
      specId: 'prysm-beacon',
      displayName: 'Prysm',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        imageName: 'gcr.io/prysmaticlabs/prysm/beacon-chain:stable',
        input: {
          docker: {
            containerVolumePath: '/data',
            raw: '-p 4000:4000 -p 13000:13000 -p 12000:12000/udp',
          },
        },
      },
      category: 'L1/ConsensusClient/BeaconNode',
      rpcTranslation: 'eth-l2-beacon',
      documentation: {
        default: 'https://docs.prylabs.network/docs/getting-started',
        docker:
          'https://docs.prylabs.network/docs/install/install-with-docker/',
      },
      iconUrl:
        'https://clientdiversity.org/assets/img/consensus-clients/prysm-logo.png',
    },
  ]);
  const [sLayer2ClientLibrary] = useState<NodeSpecification[]>([
    {
      specId: 'optimism',
      displayName: 'Optimism',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        imageName: 'eqlabs/pathfinder:latest',
      },
      category: 'L2/StarkNet',
      iconUrl:
        'https://github.com/ethereum-optimism/brand-kit/blob/main/assets/images/Profile-Logo.png?raw=true',
    },
    {
      specId: 'pathfinder',
      displayName: 'StarkNet, Pathfinder',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        imageName: 'eqlabs/pathfinder:latest',
      },
      category: 'L2/StarkNet',
      iconUrl:
        'https://equilibrium.co/_next/image?url=%2Fimages%2Fcasestudies%2Fsquare-pathfinder.png&w=640&q=75',
    },
    {
      specId: 'arbitrum',
      displayName: 'Arbitrum One',
      execution: {
        executionTypes: ['docker'],
        defaultExecutionType: 'docker',
        imageName: 'offchainlabs/arb-node:v1.3.0-d994f7d',
        input: {
          default: ['--l1.url', 'http://0.0.0.0:8545'],
          docker: {
            containerVolumePath: '/home/user/.arbitrum/mainnet',
            raw: '-p 0.0.0.0:8547:8547 -p 0.0.0.0:8548:8548',
          },
        },
        dependencies: ['L1/ExecutionClient'],
      },
      category: 'L2/ArbitrumOne',

      // api translate is same as l1
      // diff listed here: https://developer.offchainlabs.com/docs/differences_overview#json-rpc-api
      documentation: {
        default: 'https://arbitrum.io/',
        docker: 'https://developer.offchainlabs.com/docs/running_node',
      },
      iconUrl:
        'https://arbitrum.io/wp-content/uploads/2021/08/Arbitrum_Symbol-Full-color-White-background-937x1024.png',
    },
  ]);
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
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
