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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [sExecutionClientLibrary] = useState<NodeSpecification[]>([]);
  // {
  //   specId: 'nethermind',
  //   version: '1.0.0',
  //   displayName: 'Nethermind',
  //   execution: {
  //     executionTypes: ['docker', 'binary'],
  //     defaultExecutionType: 'docker',
  //     input: {
  //       defaultConfig: {
  //         http: 'Enabled',
  //       },
  //       // default: ['--JsonRpc.Enabled', 'true', '--datadir', 'data'],
  //       docker: {
  //         containerVolumePath: '/nethermind/data',
  //         // raw: '--network host', // fine on linux
  //         // raw: '-p 0.0.0.0:8545:8545/tcp', // Windows
  //         forcedRawNodeInput:
  //           '--datadir /nethermind/data --JsonRpc.Host 0.0.0.0', // Host for Windows
  //       },
  //     },
  //     architectures: {
  //       docker: ['amd64', 'arm64'],
  //       binary: ['amd64', 'arm64'],
  //     },
  //     imageName: 'nethermind/nethermind',
  //     binaryDownload: {
  //       // type: 'static',
  //       // linux: {
  //       //   amd64:
  //       //     'https://nethdev.blob.core.windows.net/builds/nethermind-linux-amd64-1.13.0-2e8910b.zip',
  //       // },
  //       type: 'githubReleases',
  //       latestVersionUrl:
  //         'https://api.github.com/repos/NethermindEth/nethermind/releases/latest',
  //       // excludeNameWith: 'portable',
  //       responseFormat: 'githubReleases', // assets[i].name contains platform and arch
  //     },
  //     execPath: 'Nethermind.Runner.exe', // Windows only?
  //   },
  //   category: 'L1/ExecutionClient',
  //   rpcTranslation: 'eth-l1',
  //   configTranslation: {
  //     dataDir: {
  //       displayName: 'Node data is stored in this folder',
  //       category: 'Storage',
  //       cliConfigPrefix: '--datadir ',
  //       defaultValue: undefined,
  //       uiControl: {
  //         type: 'filePath',
  //       },
  //     },
  //     http: {
  //       displayName:
  //         'rpc http connections (*NiceNode requires http connections)',
  //       category: 'RPC APIs',
  //       cliConfigPrefix: '--JsonRpc.Enabled ',
  //       uiControl: {
  //         type: 'select/single',
  //         controlTranslations: [
  //           {
  //             value: 'Enabled',
  //             config: 'true',
  //           },
  //           {
  //             value: 'Disabled',
  //             config: undefined,
  //           },
  //         ],
  //       },
  //       defaultValue: 'Disabled',
  //       documentation:
  //         'https://docs.nethermind.io/nethermind/ethereum-client/json-rpc',
  //     },
  //     httpApis: {
  //       displayName: 'Enabled HTTP APIs',
  //       category: 'RPC APIs',
  //       cliConfigPrefix: '--JsonRpc.EnabledModules ',
  //       valuesJoinStr: ', ',
  //       uiControl: {
  //         type: 'select/multiple',
  //         controlTranslations: [
  //           {
  //             value: 'Eth',
  //             config: 'Eth',
  //           },
  //           {
  //             value: 'Subscribe',
  //             config: 'Subscribe',
  //           },
  //           {
  //             value: 'Trace',
  //             config: 'Trace',
  //           },
  //           {
  //             value: 'TxPool',
  //             config: 'TxPool',
  //           },
  //           {
  //             value: 'Web3',
  //             config: 'Web3',
  //           },
  //           {
  //             value: 'Personal',
  //             config: 'Personal',
  //           },
  //           {
  //             value: 'Proof',
  //             config: 'Proof',
  //           },
  //           {
  //             value: 'Net',
  //             config: 'Net',
  //           },
  //           {
  //             value: 'Parity',
  //             config: 'Parity',
  //           },
  //           {
  //             value: 'Health',
  //             config: 'Health',
  //           },
  //         ],
  //       },
  //       defaultValue: [
  //         'Eth',
  //         'Subscribe',
  //         'Trace',
  //         'TxPool',
  //         'Web3',
  //         'Personal',
  //         'Proof',
  //         'Net',
  //         'Parity',
  //         'Health',
  //       ],
  //       documentation:
  //         'https://docs.nethermind.io/nethermind/ethereum-client/json-rpc',
  //     },
  //     syncMode: {
  //       displayName: 'Node synchronization mode',
  //       category: 'Syncronization',
  //       cliConfigPrefix: '--config ',
  //       uiControl: {
  //         type: 'select/single',
  //         controlTranslations: [
  //           {
  //             value: 'fast',
  //             config: 'mainnet',
  //           },
  //           {
  //             value: 'beam',
  //             config: 'mainnet_beam',
  //           },
  //           {
  //             value: 'archive',
  //             config: 'mainnet_archive',
  //           },
  //         ],
  //       },
  //       defaultValue: 'fast',
  //       documentation:
  //         'https://docs.nethermind.io/nethermind/ethereum-client/sync-modes',
  //     },
  //   },
  //   documentation: {
  //     default: 'https://docs.nethermind.io/nethermind/',
  //     docker: 'https://docs.nethermind.io/nethermind/ethereum-client/docker',
  //   },
  //   iconUrl:
  //     'https://clientdiversity.org/assets/img/execution-clients/nethermind-logo.png',
  // },
  // {
  //   specId: 'erigon',
  //   version: '1.0.0',
  //   displayName: 'Erigon',
  //   execution: {
  //     executionTypes: ['docker'],
  //     defaultExecutionType: 'docker',
  //     imageName: 'thorax/erigon:latest',
  //   },
  //   category: 'L1/ExecutionClient',
  //   rpcTranslation: 'eth-l1',
  //   iconUrl:
  //     'https://clientdiversity.org/assets/img/execution-clients/erigon-text-logo.png',
  // },
  // --rpc-http-enabled --rpc-ws-enabled
  // {
  //   specId: 'geth',
  //   version: '1.0.0',
  //   displayName: 'Geth',
  //   execution: {
  //     executionTypes: ['binary', 'docker'],
  //     defaultExecutionType: 'binary',
  //     execPath: 'geth', // windows has exe?
  //     input: {
  //       defaultConfig: {
  //         http: 'Enabled',
  //         httpCorsDomains: 'nice-node://,http://localhost',
  //       },
  //       // default: [
  //       //   '-http',
  //       //   '--http.corsdomain',
  //       //   'nice-node://,http://localhost',
  //       // ],
  //       binary: {
  //         dataDirInput: '--datadir ',
  //       },
  //     },
  //     binaryDownload: {
  //       type: 'static',
  //       darwin: {
  //         amd64:
  //           'https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.17-25c9b49f.tar.gz',
  //       },
  //       linux: {
  //         amd64:
  //           'https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.17-25c9b49f.tar.gz',
  //         amd32:
  //           'https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.10.17-25c9b49f.tar.gz',
  //         arm64:
  //           'https://gethstore.blob.core.windows.net/builds/geth-linux-arm64-1.10.17-25c9b49f.tar.gz',
  //         arm7: 'https://gethstore.blob.core.windows.net/builds/geth-linux-arm7-1.10.17-25c9b49f.tar.gz',
  //       },
  //       windows: {
  //         amd64:
  //           'https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.10.17-25c9b49f.zip',
  //         amd32:
  //           'https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.10.17-25c9b49f.zip',
  //       },
  //     },
  //   },
  //   category: 'L1/ExecutionClient',
  //   rpcTranslation: 'eth-l1',
  //   configTranslation: {
  //     dataDir: {
  //       displayName: 'Node data is stored in this folder',
  //       cliConfigPrefix: '--datadir ',
  //       defaultValue: '~/.ethereum',
  //       uiControl: {
  //         type: 'filePath',
  //       },
  //       infoDescription:
  //         'Data directory for the databases and keystore (default: "~/.ethereum")',
  //     },
  //     http: {
  //       displayName:
  //         'rpc http connections (*NiceNode requires http connections)',
  //       uiControl: {
  //         type: 'select/single',
  //         controlTranslations: [
  //           {
  //             value: 'Enabled',
  //             config: '-http',
  //           },
  //           {
  //             value: 'Disabled',
  //             config: undefined,
  //           },
  //         ],
  //       },
  //       defaultValue: 'Disabled',
  //     },
  //     httpApis: {
  //       displayName: 'Enabled HTTP APIs',
  //       cliConfigPrefix: '--http.api ',
  //       defaultValue: 'eth,net,web3',
  //       valuesJoinStr: ',',
  //       uiControl: {
  //         type: 'select/multiple',
  //         controlTranslations: [
  //           {
  //             value: 'eth',
  //             config: 'Eth',
  //           },
  //           {
  //             value: 'net',
  //             config: 'Net',
  //           },
  //           {
  //             value: 'web3',
  //             config: 'Web3',
  //           },
  //           {
  //             value: 'debug',
  //             config: 'Debug',
  //           },
  //           {
  //             value: 'personal',
  //             config: 'Personal',
  //           },
  //           {
  //             value: 'admin',
  //             config: 'Admin',
  //           },
  //         ],
  //       },
  //     },
  //     httpCorsDomains: {
  //       displayName:
  //         'Change where the node accepts http connections (use comma separated urls)',
  //       cliConfigPrefix: '--http.corsdomain ',
  //       uiControl: {
  //         type: 'text',
  //       },
  //     },
  //     syncMode: {
  //       displayName: 'Node synchronization mode',
  //       infoDescription:
  //         'Blockchain sync mode ("snap", "full" or "light") (default: snap)',
  //       category: 'Syncronization',
  //       cliConfigPrefix: '--config ',
  //       uiControl: {
  //         type: 'select/single',
  //         controlTranslations: [
  //           {
  //             value: 'snap',
  //             config: 'snap',
  //           },
  //           {
  //             value: 'light',
  //             config: 'light',
  //           },
  //           {
  //             value: 'full',
  //             config: 'full',
  //           },
  //         ],
  //       },
  //       defaultValue: 'snap',
  //       documentation:
  //         'https://docs.nethermind.io/nethermind/ethereum-client/sync-modes',
  //     },
  //   },
  //   iconUrl:
  //     'https://clientdiversity.org/assets/img/execution-clients/geth-logo.png',
  // },
  // ]);
  // const [sBeaconNodeLibrary] = useState<NodeSpecification[]>([
  // {
  //   specId: 'lodestar-beacon',
  //   version: '1.0.0',
  //   displayName: 'Lodestar',
  //   execution: {
  //     executionTypes: ['docker'],
  //     defaultExecutionType: 'docker',
  //     imageName: 'chainsafe/lodestar:latest',
  //     input: {
  //       default: ['beacon', '--rootDir /usr/app/data'],
  //       defaultConfig: {
  //         http: 'Enabled',
  //       },
  //       docker: {
  //         // containerVolumePath: '/root/.local/share/lodestar', // default?
  //         containerVolumePath: '/usr/app/data',
  //         raw: '-p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052',
  //       },
  //     },
  //   },
  //   category: 'L1/ConsensusClient/BeaconNode',
  //   rpcTranslation: 'eth-l2-beacon',
  //   nodeReleasePhase: 'beta',
  //   configTranslation: {
  //     dataDir: {
  //       displayName: 'Node data is stored in this folder',
  //       cliConfigPrefix: '--rootDir ',
  //       uiControl: {
  //         type: 'filePath',
  //       },
  //       infoDescription: 'Lodestar root directory',
  //     },
  //     http: {
  //       displayName:
  //         'rpc http connections (*NiceNode requires http connections)',
  //       cliConfigPrefix: '--api.rest.enabled ',
  //       uiControl: {
  //         type: 'select/single',
  //         controlTranslations: [
  //           {
  //             value: 'Enabled',
  //             config: 'true',
  //           },
  //           {
  //             value: 'Disabled',
  //             config: undefined,
  //           },
  //         ],
  //       },
  //       defaultValue: 'Disabled',
  //     },
  //     httpApis: {
  //       displayName: 'Enabled HTTP APIs',
  //       cliConfigPrefix: '--http.api ',
  //       defaultValue: ['beacon', 'config', 'events', 'node', 'validator'],
  //       valuesJoinStr: ',',
  //       uiControl: {
  //         type: 'select/multiple',
  //         controlTranslations: [
  //           {
  //             value: 'beacon',
  //             config: 'beacon',
  //           },
  //           {
  //             value: 'config',
  //             config: 'config',
  //           },
  //           {
  //             value: 'events',
  //             config: 'events',
  //           },
  //           {
  //             value: 'node',
  //             config: 'node',
  //           },
  //           {
  //             value: 'validator',
  //             config: 'validator',
  //           },
  //         ],
  //       },
  //     },
  //     httpPort: {
  //       displayName: 'Set port for HTTP API',
  //       cliConfigPrefix: '--api.rest.port ',
  //       defaultValue: '9596',
  //       uiControl: {
  //         type: 'text',
  //       },
  //     },
  //     httpCorsDomains: {
  //       displayName:
  //         'Change where the node accepts http connections (use comma separated urls)',
  //       cliConfigPrefix: '--http.corsdomain ',
  //       defaultValue: '*',
  //       uiControl: {
  //         type: 'text',
  //       },
  //     },
  //     // array?
  //     eth1ProviderUrl: {
  //       displayName: 'Url to Eth1 node with enabled rpc',
  //       cliConfigPrefix: '--eth1.providerUrls ',
  //       defaultValue: 'http://localhost:8545',
  //       uiControl: {
  //         type: 'text',
  //       },
  //       infoDescription:
  //         'Urls to Eth1 node with enabled rpc. If not explicity provided and execution endpoint provided via execution.urls, it will use execution.urls. Otherwise will try connecting on the specified default(s)',
  //     },
  //   },
  //   documentation: {
  //     default: 'https://chainsafe.github.io/lodestar/',
  //     docker:
  //       'https://chainsafe.github.io/lodestar/installation/#install-with-docker',
  //   },
  //   iconUrl:
  //     'https://clientdiversity.org/assets/img/consensus-clients/lodestar-logo-text.png',
  // },
  // {
  //   specId: 'teku-beacon',
  //   version: '1.0.0',
  //   displayName: 'Teku',
  //   execution: {
  //     executionTypes: ['docker'],
  //     defaultExecutionType: 'docker',
  //     imageName: 'consensys/teku:latest',
  //     input: {
  //       docker: {
  //         // containerVolumePath: '/root/.local/share/lodestar', // default?
  //         containerVolumePath: '/var/lib/teku',
  //         raw: '-p 9000:9000/tcp -p 9000:9000/udp -p 5051:5051',
  //       },
  //     },
  //   },
  //   category: 'L1/ConsensusClient/BeaconNode',
  //   rpcTranslation: 'eth-l2-beacon',
  //   configTranslation: {
  //     dataDir: {
  //       displayName: 'Node data is stored in this folder',
  //       cliConfigPrefix: '--data-path=',
  //       uiControl: {
  //         type: 'filePath',
  //       },
  //       infoDescription: 'Teku root directory',
  //       documentation:
  //         'https://docs.teku.consensys.net/en/stable/Reference/CLI/CLI-Syntax/#data-base-path-data-path',
  //     },
  //     http: {
  //       displayName:
  //         'rpc http connections (*NiceNode requires http connections)',
  //       uiControl: {
  //         type: 'select/single',
  //         controlTranslations: [
  //           {
  //             value: 'Enabled',
  //             config: '--rest-api-enabled',
  //           },
  //           {
  //             value: 'Disabled',
  //             config: undefined,
  //           },
  //         ],
  //       },
  //       defaultValue: 'Disabled',
  //       documentation:
  //         'https://docs.teku.consensys.net/en/stable/Reference/CLI/CLI-Syntax/#rest-api-enabled',
  //     },
  //     httpPort: {
  //       displayName: 'Specifies REST API listening port (HTTP).',
  //       cliConfigPrefix: '--rest-api-port=',
  //       defaultValue: '5051',
  //       uiControl: {
  //         type: 'text',
  //       },
  //       documentation:
  //         'https://docs.teku.consensys.net/en/stable/Reference/CLI/CLI-Syntax/#rest-api-port',
  //     },
  //     httpCorsDomains: {
  //       displayName:
  //         'A comma-separated list of hostnames to allow access to the REST API.',
  //       cliConfigPrefix: '--rest-api-host-allowlist=',
  //       defaultValue: 'localhost,127.0.0.1',
  //       uiControl: {
  //         type: 'text',
  //       },
  //       infoDescription:
  //         'A comma-separated list of hostnames to allow access to the REST API. By default, Teku accepts access from localhost and 127.0.0.1.',
  //       warning:
  //         'Only trusted parties should access the REST API. Do not directly expose these APIs publicly on production nodes. We don’t recommend allowing all hostnames ("*") for production environments.',
  //       documentation:
  //         'https://docs.teku.consensys.net/en/stable/Reference/CLI/CLI-Syntax/#rest-api-host-allowlist',
  //     },
  //     // array?
  //     eth1ProviderUrl: {
  //       displayName: 'Url to Eth1 node with enabled rpc',
  //       cliConfigPrefix: '--eth1-endpoint=',
  //       defaultValue: 'http://localhost:8545',
  //       uiControl: {
  //         type: 'text',
  //       },
  //       infoDescription:
  //         'Urls to Eth1 node with enabled rpc. If not explicity provided and execution endpoint provided via execution.urls, it will use execution.urls. Otherwise will try connecting on the specified default(s)',
  //       documentation:
  //         'https://docs.teku.consensys.net/en/latest/Reference/CLI/CLI-Syntax/#data-base-path-data-path',
  //     },
  //     executionEngineEndpoint: {
  //       displayName: "URL of the execution client's Engine JSON-RPC APIs",
  //       cliConfigPrefix: '--ee-endpoint=',
  //       defaultValue: 'http://localhost:8550',
  //       uiControl: {
  //         type: 'text',
  //       },
  //       infoDescription:
  //         "URL of the execution client's Engine JSON-RPC APIs. This replaces eth1-endpoint after The Merge.",
  //       documentation:
  //         'https://docs.teku.consensys.net/en/latest/Reference/CLI/CLI-Syntax/#ee-endpoint',
  //     },
  //   },
  //   documentation: {
  //     default: 'https://docs.teku.consensys.net/en/stable/',
  //     docker:
  //       'https://docs.teku.consensys.net/en/stable/HowTo/Get-Started/Installation-Options/Run-Docker-Image/',
  //   },
  //   iconUrl:
  //     'https://clientdiversity.org/assets/img/consensus-clients/teku-logo.png',
  // },
  // {
  //   specId: 'nimbus-beacon',
  //   version: '1.0.0',
  //   displayName: 'Nimbus',
  //   execution: {
  //     executionTypes: ['docker', 'binary'],
  //     defaultExecutionType: 'docker',
  //     imageName: 'statusim/nimbus-eth2:multiarch-latest',
  //     execPath: 'run-mainnet-beacon-node.sh',
  //     input: {
  //       default: [
  //         '--rest',
  //         '--rest-allow-origin="http://localhost"',
  //         '--web3-url="http://localhost:8545"',
  //       ],
  //       binary: {
  //         dataDirInput: '--data-dir=',
  //       },
  //     },
  //     binaryDownload: {
  //       type: 'githubReleases',
  //       latestVersionUrl:
  //         'https://api.github.com/repos/status-im/nimbus-eth2/releases/latest',
  //       responseFormat: 'githubReleases', // assets[i].name contains platform and arch
  //     },
  //   },
  //   category: 'L1/ConsensusClient/BeaconNode',
  //   rpcTranslation: 'eth-l2-beacon',
  //   documentation: {
  //     default: 'https://nimbus.guide/',
  //     docker: 'https://nimbus.guide/docker.html',
  //   },
  //   iconUrl:
  //     'https://clientdiversity.org/assets/img/consensus-clients/nimbus-logo-text.png',
  // },
  // {
  //   specId: 'lighthouse-beacon',
  //   version: '1.0.0',
  //   displayName: 'Lighthouse',
  //   execution: {
  //     executionTypes: ['docker', 'binary'],
  //     defaultExecutionType: 'docker',
  //     input: {
  //       default: [
  //         'lighthouse',
  //         '--network',
  //         'mainnet',
  //         'beacon',
  //         '--http',
  //         '--http-address',
  //         '0.0.0.0',
  //         '--http-allow-origin',
  //         '"*"',
  //       ],
  //       docker: {
  //         // pref host path /home/johns/.lighthouse
  //         containerVolumePath: '/root/.lighthouse',
  //         raw: '-d -p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052',
  //       },
  //       binary: {
  //         // https://lighthouse-book.sigmaprime.io/advanced-datadir.html?highlight=--datadir#relative-paths
  //         dataDirInput: '--datadir ',
  //       },
  //     },
  //     architectures: {
  //       docker: ['amd64', 'arm64'],
  //     },
  //     imageName: 'sigp/lighthouse:latest-modern',
  //     binaryDownload: {
  //       type: 'githubReleases',
  //       latestVersionUrl:
  //         'https://api.github.com/repos/sigp/lighthouse/releases/latest',
  //       excludeNameWith: 'portable',
  //       responseFormat: 'githubReleases', // assets[i].name contains platform and arch
  //     },
  //   },
  //   category: 'L1/ConsensusClient/BeaconNode',
  //   rpcTranslation: 'eth-l2-beacon',
  //   documentation: {
  //     default: 'https://lighthouse-book.sigmaprime.io/intro.html',
  //     docker: 'https://lighthouse-book.sigmaprime.io/docker.html',
  //   },
  //   iconUrl:
  //     'https://clientdiversity.org/assets/img/consensus-clients/lighthouse-logo.png',
  // },
  // {
  //   specId: 'prysm-beacon',
  //   version: '1.0.0',
  //   displayName: 'Prysm',
  //   execution: {
  //     executionTypes: ['docker'],
  //     defaultExecutionType: 'docker',
  //     imageName: 'gcr.io/prysmaticlabs/prysm/beacon-chain:stable',
  //     input: {
  //       docker: {
  //         containerVolumePath: '/data',
  //         raw: '-p 4000:4000 -p 13000:13000 -p 12000:12000/udp',
  //       },
  //     },
  //   },
  //   category: 'L1/ConsensusClient/BeaconNode',
  //   rpcTranslation: 'eth-l2-beacon',
  //   documentation: {
  //     default: 'https://docs.prylabs.network/docs/getting-started',
  //     docker:
  //       'https://docs.prylabs.network/docs/install/install-with-docker/',
  //   },
  //   iconUrl:
  //     'https://clientdiversity.org/assets/img/consensus-clients/prysm-logo.png',
  // },
  // ]);
  // const [sLayer2ClientLibrary] = useState<NodeSpecification[]>([
  // {
  //   specId: 'optimism',
  //   version: '1.0.0',
  //   displayName: 'Optimism',
  //   execution: {
  //     executionTypes: ['docker'],
  //     defaultExecutionType: 'docker',
  //     imageName: 'eqlabs/pathfinder:latest',
  //   },
  //   category: 'L2/StarkNet',
  //   iconUrl:
  //     'https://github.com/ethereum-optimism/brand-kit/blob/main/assets/images/Profile-Logo.png?raw=true',
  // },
  // {
  //   specId: 'pathfinder',
  //   version: '1.0.0',
  //   displayName: 'StarkNet, Pathfinder',
  //   execution: {
  //     executionTypes: ['docker'],
  //     defaultExecutionType: 'docker',
  //     imageName: 'eqlabs/pathfinder:latest',
  //   },
  //   category: 'L2/StarkNet',
  //   iconUrl:
  //     'https://equilibrium.co/_next/image?url=%2Fimages%2Fcasestudies%2Fsquare-pathfinder.png&w=640&q=75',
  // },
  // {
  //   specId: 'arbitrum',
  //   version: '1.0.0',
  //   displayName: 'Arbitrum One',
  //   execution: {
  //     executionTypes: ['docker'],
  //     defaultExecutionType: 'docker',
  //     imageName: 'offchainlabs/arb-node:v1.3.0-d994f7d',
  //     input: {
  //       default: ['--l1.url', 'http://0.0.0.0:8545'],
  //       docker: {
  //         containerVolumePath: '/home/user/.arbitrum/mainnet',
  //         raw: '-p 0.0.0.0:8547:8547 -p 0.0.0.0:8548:8548',
  //       },
  //     },
  //     dependencies: ['L1/ExecutionClient'],
  //   },
  //   category: 'L2/ArbitrumOne',

  //   // api translate is same as l1
  //   // diff listed here: https://developer.offchainlabs.com/docs/differences_overview#json-rpc-api
  //   documentation: {
  //     default: 'https://arbitrum.io/',
  //     docker: 'https://developer.offchainlabs.com/docs/running_node',
  //   },
  //   iconUrl:
  //     'https://arbitrum.io/wp-content/uploads/2021/08/Arbitrum_Symbol-Full-color-White-background-937x1024.png',
  // },
  // ]);
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
