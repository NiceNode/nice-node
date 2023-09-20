// import { ComponentStory, ComponentMeta } from '@storybook/react';

// import Sidebar from '../../renderer/Presentational/Sidebar/Sidebar';

// export default {
//   title: 'Presentational/Sidebar',
//   component: Sidebar,
//   argTypes: {},
// } as ComponentMeta<typeof Sidebar>;

// const Template: ComponentStory<typeof Sidebar> = (args) => (
//   <Sidebar {...args} />
// );

// export const Primary = Template.bind({});
// Primary.args = {
//   offline: false,
//   updateAvailable: false,
//   selectedNodePackageId: '86825805-9c48-4667-9473-4df440714b4e',
//   sUserNodePackages: {
//     nodes: {
//       '29030c12-a03c-4af1-985c-bc9cdeef8235': {
//         id: '29030c12-a03c-4af1-985c-bc9cdeef8235',
//         spec: {
//           specId: 'ethereum',
//           version: '1.0.0',
//           displayName: 'Ethereum',
//           displayTagline: 'Non-Validating Node - Ethereum mainnet',
//           execution: {
//             executionTypes: ['nodePackage'],
//             defaultExecutionType: 'nodePackage',
//             services: [
//               {
//                 serviceId: 'executionClient',
//                 name: 'Execution Client',
//                 nodeOptions: ['geth', 'besu', 'nethermind'],
//                 required: true,
//                 requiresCommonJwtSecret: true,
//               },
//               {
//                 serviceId: 'consensusClient',
//                 name: 'Consensus Client',
//                 nodeOptions: [
//                   'nimbus-beacon',
//                   'lighthouse-beacon',
//                   'teku-beacon',
//                   'prysm-beacon',
//                   'lodestar-beacon',
//                 ],
//                 required: true,
//                 requiresCommonJwtSecret: true,
//               },
//             ],
//           },
//           category: 'L1',
//           rpcTranslation: 'eth-l1',
//           systemRequirements: {
//             documentationUrl:
//               'https://geth.ethereum.org/docs/interface/hardware',
//             cpu: {
//               cores: 4,
//             },
//             memory: {
//               minSizeGBs: 16,
//             },
//             storage: {
//               minSizeGBs: 1600,
//               ssdRequired: true,
//             },
//             internet: {
//               minDownloadSpeedMbps: 25,
//               minUploadSpeedMbps: 10,
//             },
//             docker: {
//               required: true,
//             },
//           },
//           configTranslation: {
//             dataDir: {
//               displayName: 'Node data is stored in this folder',
//               cliConfigPrefix: '--datadir ',
//               defaultValue: '~/.ethereum',
//               uiControl: {
//                 type: 'filePath',
//               },
//               infoDescription:
//                 'Data directory for the databases and keystore (default: "~/.ethereum")',
//             },
//             network: {
//               displayName: 'mainnet or a testnet',
//               uiControl: {
//                 type: 'select/single',
//                 controlTranslations: [
//                   {
//                     value: 'Mainnet',
//                     config: '--network mainnet',
//                   },
//                   {
//                     value: 'Testnet',
//                     config: '--network testnet',
//                   },
//                 ],
//               },
//               defaultValue: 'Disabled',
//               documentation: 'https://geth.ethereum.org/docs/rpc/server',
//             },
//           },
//           iconUrl: 'https://ethereum.png',
//           description:
//             'An Ethereum node holds a copy of the Ethereum blockchain and verifies the validity of every block, keeps it up-to-date with new blocks and thelps others to download and update their own copies of the chain. In the case of Ethereum a node consists of two parts: the execution client and the consensus client. These two clients work together to verify Ethereum&apos;s state. The execution client listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state and database of all current Ethereum data. The consensus client runs the Proof-of-Stake consensus algorithm, which enables the network to achieve agreement based on validated data from the execution client.  A non-validating node does not get financial rewards but there are many benefits of running a node for any Ethereum user to consider, including privacy, security, reduced reliance on third-party servers, censorship resistance and improved health and decentralization of the network.',
//         },
//         services: [
//           {
//             serviceId: 'executionClient',
//             serviceName: 'Execution Client',
//             node: {
//               id: '9235883c-08cc-4847-89e3-a6715243b580',
//               spec: {
//                 specId: 'geth',
//                 version: '1.0.0',
//                 displayName: 'Geth',
//                 execution: {
//                   executionTypes: ['binary', 'docker'],
//                   defaultExecutionType: 'docker',
//                   execPath: 'geth',
//                   input: {
//                     defaultConfig: {
//                       http: 'Enabled',
//                       httpCorsDomains: 'http://localhost',
//                       webSockets: 'Disabled',
//                       httpVirtualHosts: 'localhost,host.containers.internal',
//                       authVirtualHosts: 'localhost,host.containers.internal',
//                       dataDir:
//                         '/Users/johns/Library/Application Support/NiceNode/nodes/geth-1694197911',
//                     },
//                     docker: {
//                       containerVolumePath: '/root/.ethereum',
//                       raw: '-p 30303:30303/tcp -p 30303:30303/udp -p 8545:8545 -p 8546:8546 -p 8551:8551',
//                       forcedRawNodeInput:
//                         '--http.addr 0.0.0.0 --authrpc.addr 0.0.0.0 --authrpc.jwtsecret /root/.ethereum/jwtsecret --ipcdisable',
//                     },
//                   },
//                   imageName: 'docker.io/ethereum/client-go:stable',
//                   binaryDownload: {
//                     type: 'static',
//                     darwin: {
//                       amd64:
//                         'https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.23-d901d853.tar.gz',
//                     },
//                     linux: {
//                       amd64:
//                         'https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.23-d901d853.tar.gz',
//                       amd32:
//                         'https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.10.23-d901d853.tar.gz',
//                       arm64:
//                         'https://gethstore.blob.core.windows.net/builds/geth-linux-arm64-1.10.23-d901d853.tar.gz',
//                       arm7: 'https://gethstore.blob.core.windows.net/builds/geth-linux-arm7-1.10.23-d901d853.tar.gz',
//                     },
//                     windows: {
//                       amd64:
//                         'https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.10.23-d901d853.zip',
//                       amd32:
//                         'https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.10.23-d901d853.zip',
//                     },
//                   },
//                 },
//                 category: 'L1/ExecutionClient',
//                 rpcTranslation: 'eth-l1',
//                 systemRequirements: {
//                   documentationUrl:
//                     'https://geth.ethereum.org/docs/interface/hardware',
//                   cpu: {
//                     cores: 4,
//                   },
//                   memory: {
//                     minSizeGBs: 16,
//                   },
//                   storage: {
//                     minSizeGBs: 1600,
//                     ssdRequired: true,
//                   },
//                   internet: {
//                     minDownloadSpeedMbps: 25,
//                     minUploadSpeedMbps: 10,
//                   },
//                   docker: {
//                     required: true,
//                   },
//                 },
//                 configTranslation: {
//                   dataDir: {
//                     displayName: 'Node data is stored in this folder',
//                     cliConfigPrefix: '--datadir ',
//                     defaultValue: '~/.ethereum',
//                     uiControl: {
//                       type: 'filePath',
//                     },
//                     infoDescription:
//                       'Data directory for the databases and keystore (default: "~/.ethereum")',
//                   },
//                   http: {
//                     displayName:
//                       'rpc http connections (*NiceNode requires http connections)',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--http',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation: 'https://geth.ethereum.org/docs/rpc/server',
//                   },
//                   webSockets: {
//                     displayName:
//                       'rpc websocket connections (*BeaconNodes may require websocket connections)',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--ws',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://geth.ethereum.org/docs/rpc/server#websocket-server',
//                   },
//                   httpApis: {
//                     displayName: 'Enabled HTTP APIs',
//                     cliConfigPrefix: '--http.api ',
//                     defaultValue: ['eth', 'net', 'web3'],
//                     valuesJoinStr: ',',
//                     uiControl: {
//                       type: 'select/multiple',
//                       controlTranslations: [
//                         {
//                           value: 'eth',
//                           config: 'eth',
//                         },
//                         {
//                           value: 'net',
//                           config: 'net',
//                         },
//                         {
//                           value: 'web3',
//                           config: 'web3',
//                         },
//                         {
//                           value: 'debug',
//                           config: 'debug',
//                         },
//                         {
//                           value: 'personal',
//                           config: 'personal',
//                         },
//                         {
//                           value: 'admin',
//                           config: 'admin',
//                         },
//                       ],
//                     },
//                   },
//                   httpCorsDomains: {
//                     displayName:
//                       'Change where the node accepts http connections (use comma separated urls)',
//                     cliConfigPrefix: '--http.corsdomain ',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   syncMode: {
//                     displayName: 'Node synchronization mode',
//                     infoDescription:
//                       'Blockchain sync mode ("snap", "full") (default: snap)',
//                     category: 'Syncronization',
//                     cliConfigPrefix: '--syncmode ',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'snap',
//                           config: 'snap',
//                         },
//                         {
//                           value: 'full',
//                           config: 'full',
//                         },
//                       ],
//                     },
//                     defaultValue: 'snap',
//                     documentation:
//                       'https://geth.ethereum.org/docs/faq#how-does-ethereum-syncing-work',
//                   },
//                   httpVirtualHosts: {
//                     displayName:
//                       "Comma separated list of virtual hostnames from which to accept requests (server enforced). Accepts '*' wildcard. Default value (localhost)",
//                     cliConfigPrefix: '--http.vhosts ',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     defaultValue: 'localhost,host.containers.internal',
//                   },
//                   httpAddress: {
//                     displayName: 'HTTP-RPC server listening interface',
//                     cliConfigPrefix: '--http.addr ',
//                     defaultValue: 'localhost',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://geth.ethereum.org/docs/rpc/server#http-server',
//                   },
//                   httpPort: {
//                     displayName: 'HTTP-RPC server listening port',
//                     cliConfigPrefix: '--http.port ',
//                     defaultValue: '8545',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://geth.ethereum.org/docs/rpc/server#http-server',
//                   },
//                   webSocketsPort: {
//                     displayName: 'WS-RPC server listening port',
//                     cliConfigPrefix: '--ws.port ',
//                     defaultValue: '8546',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://geth.ethereum.org/docs/rpc/server#websocket-server',
//                   },
//                   maxPeerCount: {
//                     displayName:
//                       'Max Peer Count (set to low number to use less bandwidth)',
//                     cliConfigPrefix: '--maxpeers ',
//                     defaultValue: '50',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://geth.ethereum.org/docs/interface/peer-to-peer#peer-limit',
//                   },
//                   authVirtualHosts: {
//                     displayName:
//                       "Comma separated list of virtual hostnames from which to accept authentication requests for engine api's (server enforced). Accepts '*' wildcard. Default value (localhost)",
//                     cliConfigPrefix: '--authrpc.vhosts ',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     defaultValue: 'localhost,host.containers.internal',
//                   },
//                 },
//                 iconUrl:
//                   'https://clientdiversity.org/assets/img/execution-clients/geth-logo.png',
//               },
//               config: {
//                 configValuesMap: {
//                   http: 'Enabled',
//                   httpCorsDomains: 'http://localhost',
//                   webSockets: 'Disabled',
//                   httpVirtualHosts: 'localhost,host.containers.internal',
//                   authVirtualHosts: 'localhost,host.containers.internal',
//                   dataDir:
//                     '/Users/johns/Library/Application Support/NiceNode/nodes/geth-1694197911',
//                 },
//               },
//               runtime: {
//                 dataDir:
//                   '/Users/johns/Library/Application Support/NiceNode/nodes/geth-1694197911',
//                 usage: {
//                   diskGBs: [],
//                   memoryBytes: [],
//                   cpuPercent: [],
//                   syncedBlock: 0,
//                 },
//               },
//               status: 'created',
//             },
//           },
//           {
//             serviceId: 'consensusClient',
//             serviceName: 'Consensus Client',
//             node: {
//               id: '07f7880d-09ca-4da0-a641-2172c4259f7b',
//               spec: {
//                 specId: 'lighthouse-beacon',
//                 version: '1.0.0',
//                 displayName: 'Lighthouse',
//                 execution: {
//                   executionTypes: ['docker', 'binary'],
//                   defaultExecutionType: 'docker',
//                   input: {
//                     defaultConfig: {
//                       http: 'Enabled',
//                       httpHostAddress: '0.0.0.0',
//                       httpCorsDomains: 'http://localhost',
//                       websockets: 'Enabled',
//                       executionEndpoint: 'http://host.containers.internal:8551',
//                       checkpointSyncUrl: 'https://mainnet.checkpoint.sigp.io',
//                       dataDir:
//                         '/Users/johns/Library/Application Support/NiceNode/nodes/lighthouse-beacon-1694197911',
//                     },
//                     docker: {
//                       containerVolumePath: '/root/.lighthouse',
//                       raw: '-p 9000:9000/tcp -p 9000:9000/udp -p 127.0.0.1:5052:5052',
//                       forcedRawNodeInput:
//                         'lighthouse --network mainnet beacon --execution-jwt /root/.lighthouse/jwtsecret',
//                     },
//                   },
//                   architectures: {
//                     docker: ['amd64', 'arm64'],
//                   },
//                   imageName: 'docker.io/sigp/lighthouse:latest-modern',
//                   binaryDownload: {
//                     type: 'githubReleases',
//                     latestVersionUrl:
//                       'https://api.github.com/repos/sigp/lighthouse/releases/latest',
//                     excludeNameWith: 'portable',
//                     responseFormat: 'githubReleases',
//                   },
//                 },
//                 category: 'L1/ConsensusClient/BeaconNode',
//                 rpcTranslation: 'eth-l1-beacon',
//                 systemRequirements: {
//                   documentationUrl:
//                     'https://lighthouse-book.sigmaprime.io/system-requirements.html',
//                   cpu: {
//                     cores: 2,
//                   },
//                   memory: {
//                     minSizeGBs: 8,
//                   },
//                   storage: {
//                     minSizeGBs: 128,
//                     ssdRequired: true,
//                   },
//                   internet: {
//                     minDownloadSpeedMbps: 10,
//                     minUploadSpeedMbps: 5,
//                   },
//                   docker: {
//                     required: true,
//                   },
//                 },
//                 configTranslation: {
//                   dataDir: {
//                     displayName: 'Node data is stored in this folder',
//                     cliConfigPrefix: '--datadir ',
//                     uiControl: {
//                       type: 'filePath',
//                     },
//                     infoDescription:
//                       'Used to specify a custom root data directory for lighthouse keys and databases. Defaults to $HOME/.lighthouse/{network} where network is the value of the `network` flag Note: Users should specify separate custom datadirs for different networks.',
//                     documentation:
//                       'https://lighthouse-book.sigmaprime.io/advanced-datadir.html?highlight=--datadir#relative-paths',
//                   },
//                   checkpointSyncUrl: {
//                     displayName: 'The URL of a trusted checkpoint sync',
//                     cliConfigPrefix: '--checkpoint-sync-url ',
//                     defaultValue: 'https://mainnet.checkpoint.sigp.io',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   http: {
//                     displayName:
//                       'rpc http connections (*NiceNode requires http connections)',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--http',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://lighthouse-book.sigmaprime.io/api-bn.html#starting-the-server',
//                   },
//                   httpHostAddress: {
//                     displayName: 'Listening address of the REST server.',
//                     cliConfigPrefix: '--http-address ',
//                     defaultValue: '127.0.0.1',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
//                   },
//                   httpPort: {
//                     displayName: 'Set port for HTTP API',
//                     cliConfigPrefix: '--http-port ',
//                     defaultValue: '5052',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://lighthouse-book.sigmaprime.io/api-bn.html#starting-the-server',
//                   },
//                   httpCorsDomains: {
//                     displayName:
//                       'Change where the node accepts http connections (use comma separated urls)',
//                     cliConfigPrefix: '--http-allow-origin ',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Set the value of the Access-Control-Allow-Origin response HTTP header. Use * to allow any origin (not recommended in production). If no value is supplied, the CORS allowed origin is set to the listen address of this server (e.g., http://localhost:5052)',
//                     documentation:
//                       'https://lighthouse-book.sigmaprime.io/api-bn.html#starting-the-server',
//                   },
//                   executionEndpoint: {
//                     displayName: 'The URL of the local execution engine API',
//                     cliConfigPrefix: '--execution-endpoint ',
//                     defaultValue: 'http://host.containers.internal:8551',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://lighthouse-book.sigmaprime.io/run_a_node.html#step-3-set-up-a-beacon-node-using-lighthouse',
//                   },
//                   maxPeerCount: {
//                     displayName:
//                       'Max Peer Count (set to low number to use less bandwidth)',
//                     cliConfigPrefix: '--target-peers ',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://lighthouse-book.sigmaprime.io/advanced_networking.html#target-peers',
//                   },
//                 },
//                 documentation: {
//                   default: 'https://lighthouse-book.sigmaprime.io/intro.html',
//                   docker: 'https://lighthouse-book.sigmaprime.io/docker.html',
//                 },
//                 iconUrl:
//                   'https://clientdiversity.org/assets/img/consensus-clients/lighthouse-logo.png',
//               },
//               config: {
//                 configValuesMap: {
//                   http: 'Enabled',
//                   httpHostAddress: '0.0.0.0',
//                   httpCorsDomains: 'http://localhost',
//                   websockets: 'Enabled',
//                   executionEndpoint: 'http://host.containers.internal:8551',
//                   checkpointSyncUrl: 'https://mainnet.checkpoint.sigp.io',
//                   dataDir:
//                     '/Users/johns/Library/Application Support/NiceNode/nodes/lighthouse-beacon-1694197911',
//                 },
//               },
//               runtime: {
//                 dataDir:
//                   '/Users/johns/Library/Application Support/NiceNode/nodes/lighthouse-beacon-1694197911',
//                 usage: {
//                   diskGBs: [],
//                   memoryBytes: [],
//                   cpuPercent: [],
//                   syncedBlock: 0,
//                 },
//               },
//               status: 'created',
//             },
//           },
//         ],
//         config: {
//           configValuesMap: {
//             dataDir:
//               '/Users/johns/Library/Application Support/NiceNode/nodes/ethereum-1694197911',
//           },
//         },
//         runtime: {
//           dataDir:
//             '/Users/johns/Library/Application Support/NiceNode/nodes/ethereum-1694197911',
//           usage: {
//             diskGBs: [],
//             memoryBytes: [],
//             cpuPercent: [],
//             syncedBlock: 0,
//           },
//         },
//         status: 'running',
//       },
//       'bc90f01a-c25c-4ff7-8a87-fcf0b8b91b7a': {
//         id: 'bc90f01a-c25c-4ff7-8a87-fcf0b8b91b7a',
//         spec: {
//           specId: 'ethereum',
//           version: '1.0.0',
//           displayName: 'Ethereum',
//           displayTagline: 'Non-Validating Node - Ethereum mainnet',
//           execution: {
//             executionTypes: ['nodePackage'],
//             defaultExecutionType: 'nodePackage',
//             services: [
//               {
//                 serviceId: 'executionClient',
//                 name: 'Execution Client',
//                 nodeOptions: ['geth', 'besu', 'nethermind'],
//                 required: true,
//                 requiresCommonJwtSecret: true,
//               },
//               {
//                 serviceId: 'consensusClient',
//                 name: 'Consensus Client',
//                 nodeOptions: [
//                   'nimbus-beacon',
//                   'lighthouse-beacon',
//                   'teku-beacon',
//                   'prysm-beacon',
//                   'lodestar-beacon',
//                 ],
//                 required: true,
//                 requiresCommonJwtSecret: true,
//               },
//             ],
//           },
//           category: 'L1',
//           rpcTranslation: 'eth-l1',
//           systemRequirements: {
//             documentationUrl:
//               'https://geth.ethereum.org/docs/interface/hardware',
//             cpu: {
//               cores: 4,
//             },
//             memory: {
//               minSizeGBs: 16,
//             },
//             storage: {
//               minSizeGBs: 1600,
//               ssdRequired: true,
//             },
//             internet: {
//               minDownloadSpeedMbps: 25,
//               minUploadSpeedMbps: 10,
//             },
//             docker: {
//               required: true,
//             },
//           },
//           configTranslation: {
//             dataDir: {
//               displayName: 'Node data is stored in this folder',
//               cliConfigPrefix: '--datadir ',
//               defaultValue: '~/.ethereum',
//               uiControl: {
//                 type: 'filePath',
//               },
//               infoDescription:
//                 'Data directory for the databases and keystore (default: "~/.ethereum")',
//             },
//             network: {
//               displayName: 'mainnet or a testnet',
//               uiControl: {
//                 type: 'select/single',
//                 controlTranslations: [
//                   {
//                     value: 'Mainnet',
//                     config: '--network mainnet',
//                   },
//                   {
//                     value: 'Testnet',
//                     config: '--network testnet',
//                   },
//                 ],
//               },
//               defaultValue: 'Disabled',
//               documentation: 'https://geth.ethereum.org/docs/rpc/server',
//             },
//           },
//           iconUrl: 'https://ethereum.png',
//           description:
//             'An Ethereum node holds a copy of the Ethereum blockchain and verifies the validity of every block, keeps it up-to-date with new blocks and thelps others to download and update their own copies of the chain. In the case of Ethereum a node consists of two parts: the execution client and the consensus client. These two clients work together to verify Ethereum&apos;s state. The execution client listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state and database of all current Ethereum data. The consensus client runs the Proof-of-Stake consensus algorithm, which enables the network to achieve agreement based on validated data from the execution client.  A non-validating node does not get financial rewards but there are many benefits of running a node for any Ethereum user to consider, including privacy, security, reduced reliance on third-party servers, censorship resistance and improved health and decentralization of the network.',
//         },
//         services: [
//           {
//             serviceId: 'executionClient',
//             serviceName: 'Execution Client',
//             node: {
//               id: '65de5133-a9f6-42b9-bc44-32dbb67d0340',
//               spec: {
//                 specId: 'besu',
//                 version: '1.0.0',
//                 displayName: 'Besu',
//                 execution: {
//                   executionTypes: ['docker'],
//                   defaultExecutionType: 'docker',
//                   imageName: 'docker.io/hyperledger/besu:latest',
//                   input: {
//                     defaultConfig: {
//                       http: 'Enabled',
//                       webSockets: 'Enabled',
//                       httpCorsDomains: '"http://localhost"',
//                       hostAllowList: 'localhost,host.containers.internal',
//                       engineRpc: 'Enabled',
//                       engineHostAllowList: 'localhost,host.containers.internal',
//                       dataDir:
//                         '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694197867',
//                     },
//                     docker: {
//                       containerVolumePath: '/var/lib/besu',
//                       raw: '-p 30303:30303/tcp -p 30303:30303/udp -p 8545:8545 -p 8546:8546 -p 8551:8551 --user 0',
//                       forcedRawNodeInput:
//                         '--data-path="/var/lib/besu" --engine-jwt-secret="/var/lib/besu/jwtsecret"',
//                     },
//                   },
//                 },
//                 category: 'L1/ExecutionClient',
//                 rpcTranslation: 'eth-l1',
//                 systemRequirements: {
//                   documentationUrl:
//                     'https://besu.hyperledger.org/en/stable/public-networks/get-started/system-requirements/',
//                   cpu: {
//                     cores: 4,
//                   },
//                   memory: {
//                     minSizeGBs: 8,
//                   },
//                   storage: {
//                     minSizeGBs: 750,
//                     ssdRequired: true,
//                   },
//                   internet: {
//                     minDownloadSpeedMbps: 10,
//                     minUploadSpeedMbps: 10,
//                   },
//                   docker: {
//                     required: true,
//                   },
//                 },
//                 configTranslation: {
//                   dataDir: {
//                     displayName: 'Node data is stored in this folder',
//                     category: 'Storage',
//                     cliConfigPrefix: '--data-path=',
//                     uiControl: {
//                       type: 'filePath',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-path',
//                   },
//                   syncMode: {
//                     displayName: 'Node synchronization mode',
//                     category: 'Syncronization',
//                     cliConfigPrefix: '--sync-mode=',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'FAST',
//                           config: 'FAST',
//                         },
//                         {
//                           value: 'FULL',
//                           config: 'FULL',
//                         },
//                       ],
//                     },
//                     defaultValue: 'FAST',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Concepts/Node-Types/',
//                   },
//                   http: {
//                     displayName:
//                       'rpc http connections (*NiceNode requires http connections)',
//                     category: 'RPC APIs',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rpc-http-enabled',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-enabled',
//                   },
//                   engineRpc: {
//                     displayName:
//                       'Engine RPC connections (*Syncing requires this enabled)',
//                     category: 'RPC API',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--engine-rpc-enabled',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/public-networks/reference/cli/options/#engine-rpc-enabled',
//                   },
//                   webSockets: {
//                     displayName:
//                       'Enables or disables the WebSocket JSON-RPC service. The default is false.',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rpc-ws-enabled=true',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-ws-enabled',
//                   },
//                   webSocketsPort: {
//                     displayName:
//                       'The port (TCP) on which WebSocket JSON-RPC listens.',
//                     cliConfigPrefix: '--rpc-ws-port=',
//                     defaultValue: '8546',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-ws-port',
//                     infoDescription:
//                       'The port (TCP) on which WebSocket JSON-RPC listens. The default is 8546. You must expose ports appropriately (https://besu.hyperledger.org/en/stable/HowTo/Find-and-Connect/Configuring-Ports/).',
//                   },
//                   httpCorsDomains: {
//                     displayName:
//                       'Change where the node accepts http connections (use comma separated urls wrapped in double quotes)',
//                     cliConfigPrefix: '--rpc-http-cors-origins=',
//                     valuesJoinStr: ',',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   httpApis: {
//                     displayName: 'Enabled certain HTTP APIs',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--rpc-http-api=',
//                     valuesJoinStr: ',',
//                     uiControl: {
//                       type: 'select/multiple',
//                       controlTranslations: [
//                         {
//                           value: 'ADMIN',
//                           config: 'ADMIN',
//                         },
//                         {
//                           value: 'CLIQUE',
//                           config: 'CLIQUE',
//                         },
//                         {
//                           value: 'DEBUG',
//                           config: 'DEBUG',
//                         },
//                         {
//                           value: 'EEA',
//                           config: 'EEA',
//                         },
//                         {
//                           value: 'ETH',
//                           config: 'ETH',
//                         },
//                         {
//                           value: 'IBFT',
//                           config: 'IBFT',
//                         },
//                         {
//                           value: 'MINER',
//                           config: 'MINER',
//                         },
//                         {
//                           value: 'NET',
//                           config: 'NET',
//                         },
//                         {
//                           value: 'PERM',
//                           config: 'PERM',
//                         },
//                         {
//                           value: 'PLUGINS',
//                           config: 'PLUGINS',
//                         },
//                         {
//                           value: 'QBFT',
//                           config: 'QBFT',
//                         },
//                         {
//                           value: 'TRACE',
//                           config: 'TRACE',
//                         },
//                         {
//                           value: 'TXPOOL',
//                           config: 'TXPOOL',
//                         },
//                         {
//                           value: 'WEB3',
//                           config: 'WEB3',
//                         },
//                       ],
//                     },
//                     defaultValue: ['ETH', 'NET', 'WEB3'],
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-api',
//                   },
//                   hostAllowList: {
//                     displayName:
//                       'A comma-separated list of hostnames to access the JSON-RPC API and pull Besu metrics. By default, Besu accepts requests from localhost and 127.0.0.1.',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--host-allowlist=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Example value: medomain.com,meotherdomain.com',
//                     defaultValue: 'localhost,127.0.0.1',
//                   },
//                   engineHostAllowList: {
//                     displayName:
//                       'A comma-separated list of hostnames to access the JSON-RPC API and pull Besu metrics. By default, Besu accepts requests from localhost and 127.0.0.1.',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--engine-host-allowlist=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Example value: medomain.com,meotherdomain.com',
//                     defaultValue:
//                       'localhost,host.containers.internal,127.0.0.1',
//                   },
//                   dataStorageFormat: {
//                     displayName: 'The data storage format to use',
//                     category: 'Storage',
//                     cliConfigPrefix: '--data-storage-format=',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'FOREST',
//                           config: 'FOREST',
//                         },
//                         {
//                           value: 'BONSAI',
//                           config: 'BONSAI',
//                         },
//                       ],
//                     },
//                     defaultValue: 'FOREST',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-storage-format',
//                   },
//                   maxPeerCount: {
//                     displayName:
//                       'Max Peer Count (set to low number to use less bandwidth)',
//                     cliConfigPrefix: '--max-peers=',
//                     defaultValue: '25',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/HowTo/Find-and-Connect/Managing-Peers/#limit-peers',
//                   },
//                 },
//                 documentation: {
//                   default: 'https://besu.hyperledger.org/en/stable/',
//                   docker:
//                     'https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Installation-Options/Run-Docker-Image/',
//                 },
//                 iconUrl:
//                   'https://clientdiversity.org/assets/img/execution-clients/besu-text-logo.png',
//               },
//               config: {
//                 configValuesMap: {
//                   http: 'Enabled',
//                   webSockets: 'Enabled',
//                   httpCorsDomains: '"http://localhost"',
//                   hostAllowList: 'localhost,host.containers.internal',
//                   engineRpc: 'Enabled',
//                   engineHostAllowList: 'localhost,host.containers.internal',
//                   dataDir:
//                     '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694197867',
//                 },
//               },
//               runtime: {
//                 dataDir:
//                   '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694197867',
//                 usage: {
//                   diskGBs: [],
//                   memoryBytes: [],
//                   cpuPercent: [],
//                   syncedBlock: 0,
//                 },
//               },
//               status: 'created',
//             },
//           },
//           {
//             serviceId: 'consensusClient',
//             serviceName: 'Consensus Client',
//             node: {
//               id: '181043b7-0620-4661-9a78-9e0e6ed625b4',
//               spec: {
//                 specId: 'nimbus-beacon',
//                 version: '1.0.0',
//                 displayName: 'Nimbus',
//                 execution: {
//                   executionTypes: ['docker', 'binary'],
//                   defaultExecutionType: 'docker',
//                   imageName: 'docker.io/statusim/nimbus-eth2:multiarch-latest',
//                   input: {
//                     defaultConfig: {
//                       http: 'Enabled',
//                       httpHostAddress: '0.0.0.0',
//                       httpCorsDomains: '"http://localhost"',
//                       executionEndpoint:
//                         '"http://host.containers.internal:8551"',
//                       dataDir:
//                         '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694197867',
//                     },
//                     docker: {
//                       containerVolumePath: '/home/user/data',
//                       raw: '-p 9000:9000/tcp -p 9000:9000/udp -p 5052:5052 --user 0',
//                       forcedRawNodeInput:
//                         '--data-dir=/home/user/data/beacon_node/mainnet_0 --network=mainnet --web3-url=http://host.containers.internal:8551 --jwt-secret=/home/user/data/jwtsecret',
//                     },
//                   },
//                   binaryDownload: {
//                     type: 'githubReleases',
//                     latestVersionUrl:
//                       'https://api.github.com/repos/status-im/nimbus-eth2/releases/latest',
//                     responseFormat: 'githubReleases',
//                   },
//                 },
//                 category: 'L1/ConsensusClient/BeaconNode',
//                 rpcTranslation: 'eth-l1-beacon',
//                 systemRequirements: {
//                   memory: {
//                     minSizeGBs: 4,
//                   },
//                   storage: {
//                     minSizeGBs: 200,
//                     ssdRequired: true,
//                   },
//                   internet: {
//                     minDownloadSpeedMbps: 8,
//                     minUploadSpeedMbps: 8,
//                   },
//                   docker: {
//                     required: true,
//                   },
//                 },
//                 configTranslation: {
//                   dataDir: {
//                     displayName:
//                       'The directory where nimbus will store all blockchain data.',
//                     cliConfigPrefix: '--data-dir=',
//                     uiControl: {
//                       type: 'filePath',
//                     },
//                     infoDescription: 'Nimbus root directory',
//                     documentation: 'https://nimbus.guide/options.html',
//                   },
//                   checkpointSyncUrl: {
//                     displayName: 'The URL of a trusted checkpoint sync',
//                     cliConfigPrefix: '--trusted-node-url=',
//                     defaultValue: 'https://beaconstate.ethstaker.cc',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   http: {
//                     displayName:
//                       'rpc http connections (*NiceNode requires http connections)',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rest',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                   },
//                   httpPort: {
//                     displayName: 'Set port for HTTP API',
//                     cliConfigPrefix: '--rest-port=',
//                     defaultValue: '5052',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   httpCorsDomains: {
//                     displayName:
//                       'Change where the node accepts http connections (use comma separated urls)',
//                     cliConfigPrefix: '--rest-allow-origin=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
//                   },
//                   httpHostAddress: {
//                     displayName: 'Listening address of the REST server.',
//                     cliConfigPrefix: '--rest-address=',
//                     defaultValue: '127.0.0.1',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
//                   },
//                   executionEndpoint: {
//                     displayName:
//                       'One or more execution layer Web3 provider URLs',
//                     cliConfigPrefix: '--web3-url=',
//                     defaultValue: '"http://host.containers.internal:8551"',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'informs the beacon node how to connect to the execution client - both http:// and ws:// URLs are supported.',
//                     documentation:
//                       'https://nimbus.guide/eth1.html#3-pass-the-url-and-jwt-secret-to-nimbus',
//                   },
//                   maxPeerCount: {
//                     displayName:
//                       'Max Peer Count (set to low number to use less bandwidth)',
//                     cliConfigPrefix: '--max-peers=',
//                     defaultValue: '160',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                 },
//                 documentation: {
//                   default: 'https://nimbus.guide/',
//                   docker: 'https://nimbus.guide/docker.html',
//                 },
//                 iconUrl:
//                   'https://clientdiversity.org/assets/img/consensus-clients/nimbus-logo-text.png',
//               },
//               config: {
//                 configValuesMap: {
//                   http: 'Enabled',
//                   httpHostAddress: '0.0.0.0',
//                   httpCorsDomains: '"http://localhost"',
//                   executionEndpoint: '"http://host.containers.internal:8551"',
//                   dataDir:
//                     '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694197867',
//                 },
//               },
//               runtime: {
//                 dataDir:
//                   '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694197867',
//                 usage: {
//                   diskGBs: [],
//                   memoryBytes: [],
//                   cpuPercent: [],
//                   syncedBlock: 0,
//                 },
//               },
//               status: 'created',
//             },
//           },
//         ],
//         config: {
//           configValuesMap: {
//             dataDir:
//               '/Users/johns/Library/Application Support/NiceNode/nodes/ethereum-1694197867',
//           },
//         },
//         runtime: {
//           dataDir:
//             '/Users/johns/Library/Application Support/NiceNode/nodes/ethereum-1694197867',
//           usage: {
//             diskGBs: [],
//             memoryBytes: [],
//             cpuPercent: [],
//             syncedBlock: 0,
//           },
//         },
//         status: 'running',
//       },
//       'd03c3876-baf3-400b-83a4-bbbb6cb6ebac': {
//         id: 'd03c3876-baf3-400b-83a4-bbbb6cb6ebac',
//         spec: {
//           specId: 'ethereum',
//           version: '1.0.0',
//           displayName: 'Ethereum',
//           displayTagline: 'Non-Validating Node - Ethereum mainnet',
//           execution: {
//             executionTypes: ['nodePackage'],
//             defaultExecutionType: 'nodePackage',
//             services: [
//               {
//                 serviceId: 'executionClient',
//                 name: 'Execution Client',
//                 nodeOptions: ['geth', 'besu', 'nethermind'],
//                 required: true,
//                 requiresCommonJwtSecret: true,
//               },
//               {
//                 serviceId: 'consensusClient',
//                 name: 'Consensus Client',
//                 nodeOptions: [
//                   'nimbus-beacon',
//                   'lighthouse-beacon',
//                   'teku-beacon',
//                   'prysm-beacon',
//                   'lodestar-beacon',
//                 ],
//                 required: true,
//                 requiresCommonJwtSecret: true,
//               },
//             ],
//           },
//           category: 'L1',
//           rpcTranslation: 'eth-l1',
//           systemRequirements: {
//             documentationUrl:
//               'https://geth.ethereum.org/docs/interface/hardware',
//             cpu: {
//               cores: 4,
//             },
//             memory: {
//               minSizeGBs: 16,
//             },
//             storage: {
//               minSizeGBs: 1600,
//               ssdRequired: true,
//             },
//             internet: {
//               minDownloadSpeedMbps: 25,
//               minUploadSpeedMbps: 10,
//             },
//             docker: {
//               required: true,
//             },
//           },
//           configTranslation: {
//             dataDir: {
//               displayName: 'Node data is stored in this folder',
//               cliConfigPrefix: '--datadir ',
//               defaultValue: '~/.ethereum',
//               uiControl: {
//                 type: 'filePath',
//               },
//               infoDescription:
//                 'Data directory for the databases and keystore (default: "~/.ethereum")',
//             },
//             network: {
//               displayName: 'mainnet or a testnet',
//               uiControl: {
//                 type: 'select/single',
//                 controlTranslations: [
//                   {
//                     value: 'Mainnet',
//                     config: '--network mainnet',
//                   },
//                   {
//                     value: 'Testnet',
//                     config: '--network testnet',
//                   },
//                 ],
//               },
//               defaultValue: 'Disabled',
//               documentation: 'https://geth.ethereum.org/docs/rpc/server',
//             },
//           },
//           iconUrl: 'https://ethereum.png',
//           description:
//             'An Ethereum node holds a copy of the Ethereum blockchain and verifies the validity of every block, keeps it up-to-date with new blocks and thelps others to download and update their own copies of the chain. In the case of Ethereum a node consists of two parts: the execution client and the consensus client. These two clients work together to verify Ethereum&apos;s state. The execution client listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state and database of all current Ethereum data. The consensus client runs the Proof-of-Stake consensus algorithm, which enables the network to achieve agreement based on validated data from the execution client.  A non-validating node does not get financial rewards but there are many benefits of running a node for any Ethereum user to consider, including privacy, security, reduced reliance on third-party servers, censorship resistance and improved health and decentralization of the network.',
//         },
//         services: [
//           {
//             serviceId: 'executionClient',
//             serviceName: 'Execution Client',
//             node: {
//               id: '34c284cc-2869-4801-be48-ed550deab744',
//               spec: {
//                 specId: 'besu',
//                 version: '1.0.0',
//                 displayName: 'Besu',
//                 execution: {
//                   executionTypes: ['docker'],
//                   defaultExecutionType: 'docker',
//                   imageName: 'docker.io/hyperledger/besu:latest',
//                   input: {
//                     defaultConfig: {
//                       http: 'Enabled',
//                       webSockets: 'Enabled',
//                       httpCorsDomains: '"http://localhost"',
//                       hostAllowList: 'localhost,host.containers.internal',
//                       engineRpc: 'Enabled',
//                       engineHostAllowList: 'localhost,host.containers.internal',
//                       dataDir:
//                         '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694197805',
//                     },
//                     docker: {
//                       containerVolumePath: '/var/lib/besu',
//                       raw: '-p 30303:30303/tcp -p 30303:30303/udp -p 8545:8545 -p 8546:8546 -p 8551:8551 --user 0',
//                       forcedRawNodeInput:
//                         '--data-path="/var/lib/besu" --engine-jwt-secret="/var/lib/besu/jwtsecret"',
//                     },
//                   },
//                 },
//                 category: 'L1/ExecutionClient',
//                 rpcTranslation: 'eth-l1',
//                 systemRequirements: {
//                   documentationUrl:
//                     'https://besu.hyperledger.org/en/stable/public-networks/get-started/system-requirements/',
//                   cpu: {
//                     cores: 4,
//                   },
//                   memory: {
//                     minSizeGBs: 8,
//                   },
//                   storage: {
//                     minSizeGBs: 750,
//                     ssdRequired: true,
//                   },
//                   internet: {
//                     minDownloadSpeedMbps: 10,
//                     minUploadSpeedMbps: 10,
//                   },
//                   docker: {
//                     required: true,
//                   },
//                 },
//                 configTranslation: {
//                   dataDir: {
//                     displayName: 'Node data is stored in this folder',
//                     category: 'Storage',
//                     cliConfigPrefix: '--data-path=',
//                     uiControl: {
//                       type: 'filePath',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-path',
//                   },
//                   syncMode: {
//                     displayName: 'Node synchronization mode',
//                     category: 'Syncronization',
//                     cliConfigPrefix: '--sync-mode=',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'FAST',
//                           config: 'FAST',
//                         },
//                         {
//                           value: 'FULL',
//                           config: 'FULL',
//                         },
//                       ],
//                     },
//                     defaultValue: 'FAST',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Concepts/Node-Types/',
//                   },
//                   http: {
//                     displayName:
//                       'rpc http connections (*NiceNode requires http connections)',
//                     category: 'RPC APIs',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rpc-http-enabled',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-enabled',
//                   },
//                   engineRpc: {
//                     displayName:
//                       'Engine RPC connections (*Syncing requires this enabled)',
//                     category: 'RPC API',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--engine-rpc-enabled',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/public-networks/reference/cli/options/#engine-rpc-enabled',
//                   },
//                   webSockets: {
//                     displayName:
//                       'Enables or disables the WebSocket JSON-RPC service. The default is false.',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rpc-ws-enabled=true',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-ws-enabled',
//                   },
//                   webSocketsPort: {
//                     displayName:
//                       'The port (TCP) on which WebSocket JSON-RPC listens.',
//                     cliConfigPrefix: '--rpc-ws-port=',
//                     defaultValue: '8546',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-ws-port',
//                     infoDescription:
//                       'The port (TCP) on which WebSocket JSON-RPC listens. The default is 8546. You must expose ports appropriately (https://besu.hyperledger.org/en/stable/HowTo/Find-and-Connect/Configuring-Ports/).',
//                   },
//                   httpCorsDomains: {
//                     displayName:
//                       'Change where the node accepts http connections (use comma separated urls wrapped in double quotes)',
//                     cliConfigPrefix: '--rpc-http-cors-origins=',
//                     valuesJoinStr: ',',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   httpApis: {
//                     displayName: 'Enabled certain HTTP APIs',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--rpc-http-api=',
//                     valuesJoinStr: ',',
//                     uiControl: {
//                       type: 'select/multiple',
//                       controlTranslations: [
//                         {
//                           value: 'ADMIN',
//                           config: 'ADMIN',
//                         },
//                         {
//                           value: 'CLIQUE',
//                           config: 'CLIQUE',
//                         },
//                         {
//                           value: 'DEBUG',
//                           config: 'DEBUG',
//                         },
//                         {
//                           value: 'EEA',
//                           config: 'EEA',
//                         },
//                         {
//                           value: 'ETH',
//                           config: 'ETH',
//                         },
//                         {
//                           value: 'IBFT',
//                           config: 'IBFT',
//                         },
//                         {
//                           value: 'MINER',
//                           config: 'MINER',
//                         },
//                         {
//                           value: 'NET',
//                           config: 'NET',
//                         },
//                         {
//                           value: 'PERM',
//                           config: 'PERM',
//                         },
//                         {
//                           value: 'PLUGINS',
//                           config: 'PLUGINS',
//                         },
//                         {
//                           value: 'QBFT',
//                           config: 'QBFT',
//                         },
//                         {
//                           value: 'TRACE',
//                           config: 'TRACE',
//                         },
//                         {
//                           value: 'TXPOOL',
//                           config: 'TXPOOL',
//                         },
//                         {
//                           value: 'WEB3',
//                           config: 'WEB3',
//                         },
//                       ],
//                     },
//                     defaultValue: ['ETH', 'NET', 'WEB3'],
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-api',
//                   },
//                   hostAllowList: {
//                     displayName:
//                       'A comma-separated list of hostnames to access the JSON-RPC API and pull Besu metrics. By default, Besu accepts requests from localhost and 127.0.0.1.',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--host-allowlist=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Example value: medomain.com,meotherdomain.com',
//                     defaultValue: 'localhost,127.0.0.1',
//                   },
//                   engineHostAllowList: {
//                     displayName:
//                       'A comma-separated list of hostnames to access the JSON-RPC API and pull Besu metrics. By default, Besu accepts requests from localhost and 127.0.0.1.',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--engine-host-allowlist=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Example value: medomain.com,meotherdomain.com',
//                     defaultValue:
//                       'localhost,host.containers.internal,127.0.0.1',
//                   },
//                   dataStorageFormat: {
//                     displayName: 'The data storage format to use',
//                     category: 'Storage',
//                     cliConfigPrefix: '--data-storage-format=',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'FOREST',
//                           config: 'FOREST',
//                         },
//                         {
//                           value: 'BONSAI',
//                           config: 'BONSAI',
//                         },
//                       ],
//                     },
//                     defaultValue: 'FOREST',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-storage-format',
//                   },
//                   maxPeerCount: {
//                     displayName:
//                       'Max Peer Count (set to low number to use less bandwidth)',
//                     cliConfigPrefix: '--max-peers=',
//                     defaultValue: '25',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/HowTo/Find-and-Connect/Managing-Peers/#limit-peers',
//                   },
//                 },
//                 documentation: {
//                   default: 'https://besu.hyperledger.org/en/stable/',
//                   docker:
//                     'https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Installation-Options/Run-Docker-Image/',
//                 },
//                 iconUrl:
//                   'https://clientdiversity.org/assets/img/execution-clients/besu-text-logo.png',
//               },
//               config: {
//                 configValuesMap: {
//                   http: 'Enabled',
//                   webSockets: 'Enabled',
//                   httpCorsDomains: '"http://localhost"',
//                   hostAllowList: 'localhost,host.containers.internal',
//                   engineRpc: 'Enabled',
//                   engineHostAllowList: 'localhost,host.containers.internal',
//                   dataDir:
//                     '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694197805',
//                 },
//               },
//               runtime: {
//                 dataDir:
//                   '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694197805',
//                 usage: {
//                   diskGBs: [],
//                   memoryBytes: [],
//                   cpuPercent: [],
//                   syncedBlock: 0,
//                 },
//               },
//               status: 'created',
//             },
//           },
//           {
//             serviceId: 'consensusClient',
//             serviceName: 'Consensus Client',
//             node: {
//               id: '0971c190-ef01-4d72-8a8f-ebd58d78cde1',
//               spec: {
//                 specId: 'nimbus-beacon',
//                 version: '1.0.0',
//                 displayName: 'Nimbus',
//                 execution: {
//                   executionTypes: ['docker', 'binary'],
//                   defaultExecutionType: 'docker',
//                   imageName: 'docker.io/statusim/nimbus-eth2:multiarch-latest',
//                   input: {
//                     defaultConfig: {
//                       http: 'Enabled',
//                       httpHostAddress: '0.0.0.0',
//                       httpCorsDomains: '"http://localhost"',
//                       executionEndpoint:
//                         '"http://host.containers.internal:8551"',
//                       dataDir:
//                         '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694197805',
//                     },
//                     docker: {
//                       containerVolumePath: '/home/user/data',
//                       raw: '-p 9000:9000/tcp -p 9000:9000/udp -p 5052:5052 --user 0',
//                       forcedRawNodeInput:
//                         '--data-dir=/home/user/data/beacon_node/mainnet_0 --network=mainnet --web3-url=http://host.containers.internal:8551 --jwt-secret=/home/user/data/jwtsecret',
//                     },
//                   },
//                   binaryDownload: {
//                     type: 'githubReleases',
//                     latestVersionUrl:
//                       'https://api.github.com/repos/status-im/nimbus-eth2/releases/latest',
//                     responseFormat: 'githubReleases',
//                   },
//                 },
//                 category: 'L1/ConsensusClient/BeaconNode',
//                 rpcTranslation: 'eth-l1-beacon',
//                 systemRequirements: {
//                   memory: {
//                     minSizeGBs: 4,
//                   },
//                   storage: {
//                     minSizeGBs: 200,
//                     ssdRequired: true,
//                   },
//                   internet: {
//                     minDownloadSpeedMbps: 8,
//                     minUploadSpeedMbps: 8,
//                   },
//                   docker: {
//                     required: true,
//                   },
//                 },
//                 configTranslation: {
//                   dataDir: {
//                     displayName:
//                       'The directory where nimbus will store all blockchain data.',
//                     cliConfigPrefix: '--data-dir=',
//                     uiControl: {
//                       type: 'filePath',
//                     },
//                     infoDescription: 'Nimbus root directory',
//                     documentation: 'https://nimbus.guide/options.html',
//                   },
//                   checkpointSyncUrl: {
//                     displayName: 'The URL of a trusted checkpoint sync',
//                     cliConfigPrefix: '--trusted-node-url=',
//                     defaultValue: 'https://beaconstate.ethstaker.cc',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   http: {
//                     displayName:
//                       'rpc http connections (*NiceNode requires http connections)',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rest',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                   },
//                   httpPort: {
//                     displayName: 'Set port for HTTP API',
//                     cliConfigPrefix: '--rest-port=',
//                     defaultValue: '5052',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   httpCorsDomains: {
//                     displayName:
//                       'Change where the node accepts http connections (use comma separated urls)',
//                     cliConfigPrefix: '--rest-allow-origin=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
//                   },
//                   httpHostAddress: {
//                     displayName: 'Listening address of the REST server.',
//                     cliConfigPrefix: '--rest-address=',
//                     defaultValue: '127.0.0.1',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
//                   },
//                   executionEndpoint: {
//                     displayName:
//                       'One or more execution layer Web3 provider URLs',
//                     cliConfigPrefix: '--web3-url=',
//                     defaultValue: '"http://host.containers.internal:8551"',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'informs the beacon node how to connect to the execution client - both http:// and ws:// URLs are supported.',
//                     documentation:
//                       'https://nimbus.guide/eth1.html#3-pass-the-url-and-jwt-secret-to-nimbus',
//                   },
//                   maxPeerCount: {
//                     displayName:
//                       'Max Peer Count (set to low number to use less bandwidth)',
//                     cliConfigPrefix: '--max-peers=',
//                     defaultValue: '160',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                 },
//                 documentation: {
//                   default: 'https://nimbus.guide/',
//                   docker: 'https://nimbus.guide/docker.html',
//                 },
//                 iconUrl:
//                   'https://clientdiversity.org/assets/img/consensus-clients/nimbus-logo-text.png',
//               },
//               config: {
//                 configValuesMap: {
//                   http: 'Enabled',
//                   httpHostAddress: '0.0.0.0',
//                   httpCorsDomains: '"http://localhost"',
//                   executionEndpoint: '"http://host.containers.internal:8551"',
//                   dataDir:
//                     '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694197805',
//                 },
//               },
//               runtime: {
//                 dataDir:
//                   '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694197805',
//                 usage: {
//                   diskGBs: [],
//                   memoryBytes: [],
//                   cpuPercent: [],
//                   syncedBlock: 0,
//                 },
//               },
//               status: 'created',
//             },
//           },
//         ],
//         config: {
//           configValuesMap: {
//             dataDir:
//               '/Users/johns/Library/Application Support/NiceNode/nodes/ethereum-1694197805',
//           },
//         },
//         runtime: {
//           dataDir:
//             '/Users/johns/Library/Application Support/NiceNode/nodes/ethereum-1694197805',
//           usage: {
//             diskGBs: [],
//             memoryBytes: [],
//             cpuPercent: [],
//             syncedBlock: 0,
//           },
//         },
//         status: 'running',
//       },
//       '0f1d0a22-1e2c-4204-be53-af296a34da31': {
//         id: '0f1d0a22-1e2c-4204-be53-af296a34da31',
//         spec: {
//           specId: 'ethereum',
//           version: '1.0.0',
//           displayName: 'Ethereum',
//           displayTagline: 'Non-Validating Node - Ethereum mainnet',
//           execution: {
//             executionTypes: ['nodePackage'],
//             defaultExecutionType: 'nodePackage',
//             services: [
//               {
//                 serviceId: 'executionClient',
//                 name: 'Execution Client',
//                 nodeOptions: ['geth', 'besu', 'nethermind'],
//                 required: true,
//                 requiresCommonJwtSecret: true,
//               },
//               {
//                 serviceId: 'consensusClient',
//                 name: 'Consensus Client',
//                 nodeOptions: [
//                   'nimbus-beacon',
//                   'lighthouse-beacon',
//                   'teku-beacon',
//                   'prysm-beacon',
//                   'lodestar-beacon',
//                 ],
//                 required: true,
//                 requiresCommonJwtSecret: true,
//               },
//             ],
//           },
//           category: 'L1',
//           rpcTranslation: 'eth-l1',
//           systemRequirements: {
//             documentationUrl:
//               'https://geth.ethereum.org/docs/interface/hardware',
//             cpu: {
//               cores: 4,
//             },
//             memory: {
//               minSizeGBs: 16,
//             },
//             storage: {
//               minSizeGBs: 1600,
//               ssdRequired: true,
//             },
//             internet: {
//               minDownloadSpeedMbps: 25,
//               minUploadSpeedMbps: 10,
//             },
//             docker: {
//               required: true,
//             },
//           },
//           configTranslation: {
//             dataDir: {
//               displayName: 'Node data is stored in this folder',
//               cliConfigPrefix: '--datadir ',
//               defaultValue: '~/.ethereum',
//               uiControl: {
//                 type: 'filePath',
//               },
//               infoDescription:
//                 'Data directory for the databases and keystore (default: "~/.ethereum")',
//             },
//             network: {
//               displayName: 'mainnet or a testnet',
//               uiControl: {
//                 type: 'select/single',
//                 controlTranslations: [
//                   {
//                     value: 'Mainnet',
//                     config: '--network mainnet',
//                   },
//                   {
//                     value: 'Testnet',
//                     config: '--network testnet',
//                   },
//                 ],
//               },
//               defaultValue: 'Disabled',
//               documentation: 'https://geth.ethereum.org/docs/rpc/server',
//             },
//           },
//           iconUrl: 'https://ethereum.png',
//           description:
//             'An Ethereum node holds a copy of the Ethereum blockchain and verifies the validity of every block, keeps it up-to-date with new blocks and thelps others to download and update their own copies of the chain. In the case of Ethereum a node consists of two parts: the execution client and the consensus client. These two clients work together to verify Ethereum&apos;s state. The execution client listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state and database of all current Ethereum data. The consensus client runs the Proof-of-Stake consensus algorithm, which enables the network to achieve agreement based on validated data from the execution client.  A non-validating node does not get financial rewards but there are many benefits of running a node for any Ethereum user to consider, including privacy, security, reduced reliance on third-party servers, censorship resistance and improved health and decentralization of the network.',
//         },
//         services: [
//           {
//             serviceId: 'executionClient',
//             serviceName: 'Execution Client',
//             node: {
//               id: '505d21a6-cbec-4256-8334-5f9efe0e7472',
//               spec: {
//                 specId: 'besu',
//                 version: '1.0.0',
//                 displayName: 'Besu',
//                 execution: {
//                   executionTypes: ['docker'],
//                   defaultExecutionType: 'docker',
//                   imageName: 'docker.io/hyperledger/besu:latest',
//                   input: {
//                     defaultConfig: {
//                       http: 'Enabled',
//                       webSockets: 'Enabled',
//                       httpCorsDomains: '"http://localhost"',
//                       hostAllowList: 'localhost,host.containers.internal',
//                       engineRpc: 'Enabled',
//                       engineHostAllowList: 'localhost,host.containers.internal',
//                       dataDir:
//                         '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694206676',
//                     },
//                     docker: {
//                       containerVolumePath: '/var/lib/besu',
//                       raw: '-p 30303:30303/tcp -p 30303:30303/udp -p 8545:8545 -p 8546:8546 -p 8551:8551 --user 0',
//                       forcedRawNodeInput:
//                         '--data-path="/var/lib/besu" --engine-jwt-secret="/var/lib/besu/jwtsecret"',
//                     },
//                   },
//                 },
//                 category: 'L1/ExecutionClient',
//                 rpcTranslation: 'eth-l1',
//                 systemRequirements: {
//                   documentationUrl:
//                     'https://besu.hyperledger.org/en/stable/public-networks/get-started/system-requirements/',
//                   cpu: {
//                     cores: 4,
//                   },
//                   memory: {
//                     minSizeGBs: 8,
//                   },
//                   storage: {
//                     minSizeGBs: 750,
//                     ssdRequired: true,
//                   },
//                   internet: {
//                     minDownloadSpeedMbps: 10,
//                     minUploadSpeedMbps: 10,
//                   },
//                   docker: {
//                     required: true,
//                   },
//                 },
//                 configTranslation: {
//                   dataDir: {
//                     displayName: 'Node data is stored in this folder',
//                     category: 'Storage',
//                     cliConfigPrefix: '--data-path=',
//                     uiControl: {
//                       type: 'filePath',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-path',
//                   },
//                   syncMode: {
//                     displayName: 'Node synchronization mode',
//                     category: 'Syncronization',
//                     cliConfigPrefix: '--sync-mode=',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'FAST',
//                           config: 'FAST',
//                         },
//                         {
//                           value: 'FULL',
//                           config: 'FULL',
//                         },
//                       ],
//                     },
//                     defaultValue: 'FAST',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Concepts/Node-Types/',
//                   },
//                   http: {
//                     displayName:
//                       'rpc http connections (*NiceNode requires http connections)',
//                     category: 'RPC APIs',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rpc-http-enabled',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-enabled',
//                   },
//                   engineRpc: {
//                     displayName:
//                       'Engine RPC connections (*Syncing requires this enabled)',
//                     category: 'RPC API',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--engine-rpc-enabled',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/public-networks/reference/cli/options/#engine-rpc-enabled',
//                   },
//                   webSockets: {
//                     displayName:
//                       'Enables or disables the WebSocket JSON-RPC service. The default is false.',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rpc-ws-enabled=true',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-ws-enabled',
//                   },
//                   webSocketsPort: {
//                     displayName:
//                       'The port (TCP) on which WebSocket JSON-RPC listens.',
//                     cliConfigPrefix: '--rpc-ws-port=',
//                     defaultValue: '8546',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-ws-port',
//                     infoDescription:
//                       'The port (TCP) on which WebSocket JSON-RPC listens. The default is 8546. You must expose ports appropriately (https://besu.hyperledger.org/en/stable/HowTo/Find-and-Connect/Configuring-Ports/).',
//                   },
//                   httpCorsDomains: {
//                     displayName:
//                       'Change where the node accepts http connections (use comma separated urls wrapped in double quotes)',
//                     cliConfigPrefix: '--rpc-http-cors-origins=',
//                     valuesJoinStr: ',',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   httpApis: {
//                     displayName: 'Enabled certain HTTP APIs',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--rpc-http-api=',
//                     valuesJoinStr: ',',
//                     uiControl: {
//                       type: 'select/multiple',
//                       controlTranslations: [
//                         {
//                           value: 'ADMIN',
//                           config: 'ADMIN',
//                         },
//                         {
//                           value: 'CLIQUE',
//                           config: 'CLIQUE',
//                         },
//                         {
//                           value: 'DEBUG',
//                           config: 'DEBUG',
//                         },
//                         {
//                           value: 'EEA',
//                           config: 'EEA',
//                         },
//                         {
//                           value: 'ETH',
//                           config: 'ETH',
//                         },
//                         {
//                           value: 'IBFT',
//                           config: 'IBFT',
//                         },
//                         {
//                           value: 'MINER',
//                           config: 'MINER',
//                         },
//                         {
//                           value: 'NET',
//                           config: 'NET',
//                         },
//                         {
//                           value: 'PERM',
//                           config: 'PERM',
//                         },
//                         {
//                           value: 'PLUGINS',
//                           config: 'PLUGINS',
//                         },
//                         {
//                           value: 'QBFT',
//                           config: 'QBFT',
//                         },
//                         {
//                           value: 'TRACE',
//                           config: 'TRACE',
//                         },
//                         {
//                           value: 'TXPOOL',
//                           config: 'TXPOOL',
//                         },
//                         {
//                           value: 'WEB3',
//                           config: 'WEB3',
//                         },
//                       ],
//                     },
//                     defaultValue: ['ETH', 'NET', 'WEB3'],
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-api',
//                   },
//                   hostAllowList: {
//                     displayName:
//                       'A comma-separated list of hostnames to access the JSON-RPC API and pull Besu metrics. By default, Besu accepts requests from localhost and 127.0.0.1.',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--host-allowlist=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Example value: medomain.com,meotherdomain.com',
//                     defaultValue: 'localhost,127.0.0.1',
//                   },
//                   engineHostAllowList: {
//                     displayName:
//                       'A comma-separated list of hostnames to access the JSON-RPC API and pull Besu metrics. By default, Besu accepts requests from localhost and 127.0.0.1.',
//                     category: 'RPC APIs',
//                     cliConfigPrefix: '--engine-host-allowlist=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Example value: medomain.com,meotherdomain.com',
//                     defaultValue:
//                       'localhost,host.containers.internal,127.0.0.1',
//                   },
//                   dataStorageFormat: {
//                     displayName: 'The data storage format to use',
//                     category: 'Storage',
//                     cliConfigPrefix: '--data-storage-format=',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'FOREST',
//                           config: 'FOREST',
//                         },
//                         {
//                           value: 'BONSAI',
//                           config: 'BONSAI',
//                         },
//                       ],
//                     },
//                     defaultValue: 'FOREST',
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-storage-format',
//                   },
//                   maxPeerCount: {
//                     displayName:
//                       'Max Peer Count (set to low number to use less bandwidth)',
//                     cliConfigPrefix: '--max-peers=',
//                     defaultValue: '25',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     documentation:
//                       'https://besu.hyperledger.org/en/stable/HowTo/Find-and-Connect/Managing-Peers/#limit-peers',
//                   },
//                 },
//                 documentation: {
//                   default: 'https://besu.hyperledger.org/en/stable/',
//                   docker:
//                     'https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Installation-Options/Run-Docker-Image/',
//                 },
//                 iconUrl:
//                   'https://clientdiversity.org/assets/img/execution-clients/besu-text-logo.png',
//               },
//               config: {
//                 configValuesMap: {
//                   http: 'Enabled',
//                   webSockets: 'Enabled',
//                   httpCorsDomains: '"http://localhost"',
//                   hostAllowList: 'localhost,host.containers.internal',
//                   engineRpc: 'Enabled',
//                   engineHostAllowList: 'localhost,host.containers.internal',
//                   dataDir:
//                     '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694206676',
//                 },
//               },
//               runtime: {
//                 dataDir:
//                   '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1694206676',
//                 usage: {
//                   diskGBs: [],
//                   memoryBytes: [],
//                   cpuPercent: [],
//                   syncedBlock: 0,
//                 },
//               },
//               status: 'created',
//             },
//           },
//           {
//             serviceId: 'consensusClient',
//             serviceName: 'Consensus Client',
//             node: {
//               id: '04818826-6819-4d9c-b700-42f004ad0a78',
//               spec: {
//                 specId: 'nimbus-beacon',
//                 version: '1.0.0',
//                 displayName: 'Nimbus',
//                 execution: {
//                   executionTypes: ['docker', 'binary'],
//                   defaultExecutionType: 'docker',
//                   imageName: 'docker.io/statusim/nimbus-eth2:multiarch-latest',
//                   input: {
//                     defaultConfig: {
//                       http: 'Enabled',
//                       httpHostAddress: '0.0.0.0',
//                       httpCorsDomains: '"http://localhost"',
//                       executionEndpoint:
//                         '"http://host.containers.internal:8551"',
//                       dataDir:
//                         '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694206676',
//                     },
//                     docker: {
//                       containerVolumePath: '/home/user/data',
//                       raw: '-p 9000:9000/tcp -p 9000:9000/udp -p 5052:5052 --user 0',
//                       forcedRawNodeInput:
//                         '--data-dir=/home/user/data/beacon_node/mainnet_0 --network=mainnet --web3-url=http://host.containers.internal:8551 --jwt-secret=/home/user/data/jwtsecret',
//                     },
//                   },
//                   binaryDownload: {
//                     type: 'githubReleases',
//                     latestVersionUrl:
//                       'https://api.github.com/repos/status-im/nimbus-eth2/releases/latest',
//                     responseFormat: 'githubReleases',
//                   },
//                 },
//                 category: 'L1/ConsensusClient/BeaconNode',
//                 rpcTranslation: 'eth-l1-beacon',
//                 systemRequirements: {
//                   memory: {
//                     minSizeGBs: 4,
//                   },
//                   storage: {
//                     minSizeGBs: 200,
//                     ssdRequired: true,
//                   },
//                   internet: {
//                     minDownloadSpeedMbps: 8,
//                     minUploadSpeedMbps: 8,
//                   },
//                   docker: {
//                     required: true,
//                   },
//                 },
//                 configTranslation: {
//                   dataDir: {
//                     displayName:
//                       'The directory where nimbus will store all blockchain data.',
//                     cliConfigPrefix: '--data-dir=',
//                     uiControl: {
//                       type: 'filePath',
//                     },
//                     infoDescription: 'Nimbus root directory',
//                     documentation: 'https://nimbus.guide/options.html',
//                   },
//                   checkpointSyncUrl: {
//                     displayName: 'The URL of a trusted checkpoint sync',
//                     cliConfigPrefix: '--trusted-node-url=',
//                     defaultValue: 'https://beaconstate.ethstaker.cc',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   http: {
//                     displayName:
//                       'rpc http connections (*NiceNode requires http connections)',
//                     uiControl: {
//                       type: 'select/single',
//                       controlTranslations: [
//                         {
//                           value: 'Enabled',
//                           config: '--rest',
//                         },
//                         {
//                           value: 'Disabled',
//                         },
//                       ],
//                     },
//                     defaultValue: 'Disabled',
//                   },
//                   httpPort: {
//                     displayName: 'Set port for HTTP API',
//                     cliConfigPrefix: '--rest-port=',
//                     defaultValue: '5052',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                   httpCorsDomains: {
//                     displayName:
//                       'Change where the node accepts http connections (use comma separated urls)',
//                     cliConfigPrefix: '--rest-allow-origin=',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
//                   },
//                   httpHostAddress: {
//                     displayName: 'Listening address of the REST server.',
//                     cliConfigPrefix: '--rest-address=',
//                     defaultValue: '127.0.0.1',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
//                   },
//                   executionEndpoint: {
//                     displayName:
//                       'One or more execution layer Web3 provider URLs',
//                     cliConfigPrefix: '--web3-url=',
//                     defaultValue: '"http://host.containers.internal:8551"',
//                     uiControl: {
//                       type: 'text',
//                     },
//                     infoDescription:
//                       'informs the beacon node how to connect to the execution client - both http:// and ws:// URLs are supported.',
//                     documentation:
//                       'https://nimbus.guide/eth1.html#3-pass-the-url-and-jwt-secret-to-nimbus',
//                   },
//                   maxPeerCount: {
//                     displayName:
//                       'Max Peer Count (set to low number to use less bandwidth)',
//                     cliConfigPrefix: '--max-peers=',
//                     defaultValue: '160',
//                     uiControl: {
//                       type: 'text',
//                     },
//                   },
//                 },
//                 documentation: {
//                   default: 'https://nimbus.guide/',
//                   docker: 'https://nimbus.guide/docker.html',
//                 },
//                 iconUrl:
//                   'https://clientdiversity.org/assets/img/consensus-clients/nimbus-logo-text.png',
//               },
//               config: {
//                 configValuesMap: {
//                   http: 'Enabled',
//                   httpHostAddress: '0.0.0.0',
//                   httpCorsDomains: '"http://localhost"',
//                   executionEndpoint: '"http://host.containers.internal:8551"',
//                   dataDir:
//                     '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694206676',
//                 },
//               },
//               runtime: {
//                 dataDir:
//                   '/Users/johns/Library/Application Support/NiceNode/nodes/nimbus-beacon-1694206676',
//                 usage: {
//                   diskGBs: [],
//                   memoryBytes: [],
//                   cpuPercent: [],
//                   syncedBlock: 0,
//                 },
//               },
//             },
//           },
//         ],
//         config: {
//           configValuesMap: {
//             dataDir:
//               '/Users/johns/Library/Application Support/NiceNode/nodes/ethereum-1694206676',
//           },
//         },
//         runtime: {
//           dataDir:
//             '/Users/johns/Library/Application Support/NiceNode/nodes/ethereum-1694206676',
//           usage: {
//             diskGBs: [],
//             memoryBytes: [],
//             cpuPercent: [],
//             syncedBlock: 0,
//           },
//         },
//       },
//     },
//     nodeIds: ['0f1d0a22-1e2c-4204-be53-af296a34da31'],
//   },
// };
