import { ComponentStory, ComponentMeta } from '@storybook/react';

import Sidebar from '../../renderer/Presentational/Sidebar/Sidebar';

export default {
  title: 'Presentational/Sidebar',
  component: Sidebar,
  argTypes: {},
} as ComponentMeta<typeof Sidebar>;

const Template: ComponentStory<typeof Sidebar> = (args) => (
  <Sidebar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  offline: false,
  updateAvailable: false,
  sUserNodes: {
    nodes: {
      '86825805-9c48-4667-9473-4df440714b4e': {
        id: '86825805-9c48-4667-9473-4df440714b4e',
        spec: {
          specId: 'besu',
          version: '1.0.0',
          displayName: 'Besu',
          execution: {
            executionTypes: ['docker'],
            defaultExecutionType: 'docker',
            imageName: 'hyperledger/besu:latest',
            input: {
              defaultConfig: {
                http: 'Enabled',
                webSockets: 'Enabled',
                httpCorsDomains: '"http://localhost"',
                hostAllowList: 'localhost,host.docker.internal',
                dataDir:
                  '/Library/Application Support/NiceNode/nodes/besu-1667264729',
              },
              docker: {
                containerVolumePath: '/var/lib/besu',
                raw: '-p 30303:30303/tcp -p 30303:30303/udp -p 8545:8545 -p 8546:8546',
                forcedRawNodeInput: '--data-path="/var/lib/besu"',
              },
            },
          },
          category: 'L1/ExecutionClient',
          rpcTranslation: 'eth-l1',
          systemRequirements: {
            documentationUrl:
              'https://besu.hyperledger.org/en/stable/public-networks/get-started/system-requirements/',
            cpu: {
              cores: 4,
            },
            memory: {
              minSizeGBs: 8,
            },
            storage: {
              minSizeGBs: 750,
              ssdRequired: true,
            },
            internet: {
              minDownloadSpeedMbps: 10,
              minUploadSpeedMbps: 10,
            },
            docker: {
              required: true,
            },
          },
          configTranslation: {
            dataDir: {
              displayName: 'Node data is stored in this folder',
              category: 'Storage',
              cliConfigPrefix: '--data-path=',
              uiControl: {
                type: 'filePath',
              },
              documentation:
                'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-path',
            },
            syncMode: {
              displayName: 'Node synchronization mode',
              category: 'Syncronization',
              cliConfigPrefix: '--sync-mode=',
              uiControl: {
                type: 'select/single',
                controlTranslations: [
                  {
                    value: 'FAST',
                    config: 'FAST',
                  },
                  {
                    value: 'FULL',
                    config: 'FULL',
                  },
                ],
              },
              defaultValue: 'FAST',
              documentation:
                'https://besu.hyperledger.org/en/stable/Concepts/Node-Types/',
            },
            http: {
              displayName:
                'rpc http connections (*NiceNode requires http connections)',
              category: 'RPC APIs',
              uiControl: {
                type: 'select/single',
                controlTranslations: [
                  {
                    value: 'Enabled',
                    config: '--rpc-http-enabled',
                  },
                  {
                    value: 'Disabled',
                  },
                ],
              },
              defaultValue: 'Disabled',
              documentation:
                'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-enabled',
            },
            webSockets: {
              displayName:
                'Enables or disables the WebSocket JSON-RPC service. The default is false.',
              uiControl: {
                type: 'select/single',
                controlTranslations: [
                  {
                    value: 'Enabled',
                    config: '--rpc-ws-enabled=true',
                  },
                  {
                    value: 'Disabled',
                  },
                ],
              },
              defaultValue: 'Disabled',
              documentation:
                'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-ws-enabled',
            },
            webSocketsPort: {
              displayName:
                'The port (TCP) on which WebSocket JSON-RPC listens.',
              cliConfigPrefix: '--rpc-ws-port=',
              defaultValue: '8546',
              uiControl: {
                type: 'text',
              },
              documentation:
                'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-ws-port',
              infoDescription:
                'The port (TCP) on which WebSocket JSON-RPC listens. The default is 8546. You must expose ports appropriately (https://besu.hyperledger.org/en/stable/HowTo/Find-and-Connect/Configuring-Ports/).',
            },
            httpCorsDomains: {
              displayName:
                'Change where the node accepts http connections (use comma separated urls wrapped in double quotes)',
              cliConfigPrefix: '--rpc-http-cors-origins=',
              valuesJoinStr: ',',
              uiControl: {
                type: 'text',
              },
            },
            httpApis: {
              displayName: 'Enabled certain HTTP APIs',
              category: 'RPC APIs',
              cliConfigPrefix: '--rpc-http-api=',
              valuesJoinStr: ',',
              uiControl: {
                type: 'select/multiple',
                controlTranslations: [
                  {
                    value: 'ADMIN',
                    config: 'ADMIN',
                  },
                  {
                    value: 'CLIQUE',
                    config: 'CLIQUE',
                  },
                  {
                    value: 'DEBUG',
                    config: 'DEBUG',
                  },
                  {
                    value: 'EEA',
                    config: 'EEA',
                  },
                  {
                    value: 'ETH',
                    config: 'ETH',
                  },
                  {
                    value: 'IBFT',
                    config: 'IBFT',
                  },
                  {
                    value: 'MINER',
                    config: 'MINER',
                  },
                  {
                    value: 'NET',
                    config: 'NET',
                  },
                  {
                    value: 'PERM',
                    config: 'PERM',
                  },
                  {
                    value: 'PLUGINS',
                    config: 'PLUGINS',
                  },
                  {
                    value: 'QBFT',
                    config: 'QBFT',
                  },
                  {
                    value: 'TRACE',
                    config: 'TRACE',
                  },
                  {
                    value: 'TXPOOL',
                    config: 'TXPOOL',
                  },
                  {
                    value: 'WEB3',
                    config: 'WEB3',
                  },
                ],
              },
              defaultValue: ['ETH', 'NET', 'WEB3'],
              documentation:
                'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#rpc-http-api',
            },
            hostAllowList: {
              displayName:
                'A comma-separated list of hostnames to access the JSON-RPC API and pull Besu metrics. By default, Besu accepts requests from localhost and 127.0.0.1.',
              category: 'RPC APIs',
              cliConfigPrefix: '--host-allowlist=',
              uiControl: {
                type: 'text',
              },
              infoDescription: 'Example value: medomain.com,meotherdomain.com',
              defaultValue: 'localhost,127.0.0.1',
            },
            dataStorageFormat: {
              displayName: 'The data storage format to use',
              category: 'Storage',
              cliConfigPrefix: '--data-storage-format=',
              uiControl: {
                type: 'select/single',
                controlTranslations: [
                  {
                    value: 'FOREST',
                    config: 'FOREST',
                  },
                  {
                    value: 'BONSAI',
                    config: 'BONSAI',
                  },
                ],
              },
              defaultValue: 'FOREST',
              documentation:
                'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-storage-format',
            },
            maxPeerCount: {
              displayName:
                'Max Peer Count (set to low number to use less bandwidth)',
              cliConfigPrefix: '--max-peers=',
              defaultValue: '25',
              uiControl: {
                type: 'text',
              },
              documentation:
                'https://besu.hyperledger.org/en/stable/HowTo/Find-and-Connect/Managing-Peers/#limit-peers',
            },
          },
          documentation: {
            default: 'https://besu.hyperledger.org/en/stable/',
            docker:
              'https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Installation-Options/Run-Docker-Image/',
          },
          iconUrl:
            'https://clientdiversity.org/assets/img/execution-clients/besu-text-logo.png',
        },
        config: {
          configValuesMap: {
            http: 'Enabled',
            webSockets: 'Enabled',
            httpCorsDomains: '"http://localhost"',
            hostAllowList: 'localhost,host.docker.internal',
            dataDir:
              '/Library/Application Support/NiceNode/nodes/besu-1667264729',
            syncMode: 'FULL',
          },
        },
        runtime: {
          dataDir:
            '/Library/Application Support/NiceNode/nodes/besu-1667264729',
          usage: {
            diskGBs: 0.0022009760000000003,
            memoryBytes: 0,
            cpuPercent: 0,
          },
          processIds: [
            '63fe38e8f9ef52474e92a3e469e93a056100c9a45e382d1581bd0f2945549eeb',
          ],
        },
        status: 'stopped',
        lastStopped: '2022-11-01T01:05:37.061103099Z',
      },
      'd5f390cb-d48c-46b5-8ae4-b41701bed176': {
        id: 'd5f390cb-d48c-46b5-8ae4-b41701bed176',
        spec: {
          specId: 'nimbus',
          version: '1.0.0',
          displayName: 'Nimbus',
          execution: {
            executionTypes: ['docker', 'binary'],
            defaultExecutionType: 'docker',
            imageName: 'statusim/nimbus-eth2:multiarch-latest',
            execPath: 'run-mainnet-beacon-node.sh',
            input: {
              defaultConfig: {
                http: 'Enabled',
                httpHostAddress: '0.0.0.0',
                httpCorsDomains: '"http://localhost"',
                eth1ProviderUrl: '"ws://host.docker.internal:8546"',
                dataDir:
                  '/Library/Application Support/NiceNode/nodes/nimbus-1667264729',
              },
              docker: {
                containerVolumePath: '/home/user/nimbus-eth2/build/data',
                raw: '--add-host=host.docker.internal:host-gateway -p 9000:9000/tcp -p 9000:9000/udp -p 5052:5052',
                forcedRawNodeInput:
                  '--data-dir=build/data/shared_mainnet_0 --network=mainnet',
              },
            },
            binaryDownload: {
              type: 'githubReleases',
              latestVersionUrl:
                'https://api.github.com/repos/status-im/nimbus-eth2/releases/latest',
              responseFormat: 'githubReleases',
            },
          },
          category: 'L1/ConsensusClient/BeaconNode',
          rpcTranslation: 'eth-l1-beacon',
          systemRequirements: {
            memory: {
              minSizeGBs: 4,
            },
            storage: {
              minSizeGBs: 200,
              ssdRequired: true,
            },
            internet: {
              minDownloadSpeedMbps: 8,
              minUploadSpeedMbps: 8,
            },
            docker: {
              required: true,
            },
          },
          configTranslation: {
            dataDir: {
              displayName:
                'The directory where nimbus will store all blockchain data.',
              cliConfigPrefix: '--data-dir=',
              uiControl: {
                type: 'filePath',
              },
              infoDescription: 'Nimbus root directory',
              documentation: 'https://nimbus.guide/options.html',
            },
            http: {
              displayName:
                'rpc http connections (*NiceNode requires http connections)',
              uiControl: {
                type: 'select/single',
                controlTranslations: [
                  {
                    value: 'Enabled',
                    config: '--rest',
                  },
                  {
                    value: 'Disabled',
                  },
                ],
              },
              defaultValue: 'Disabled',
            },
            httpPort: {
              displayName: 'Set port for HTTP API',
              cliConfigPrefix: '--rest-port=',
              defaultValue: '5052',
              uiControl: {
                type: 'text',
              },
            },
            httpCorsDomains: {
              displayName:
                'Change where the node accepts http connections (use comma separated urls)',
              cliConfigPrefix: '--rest-allow-origin=',
              uiControl: {
                type: 'text',
              },
              infoDescription:
                'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
            },
            httpHostAddress: {
              displayName: 'Listening address of the REST server.',
              cliConfigPrefix: '--rest-address=',
              defaultValue: '127.0.0.1',
              uiControl: {
                type: 'text',
              },
              infoDescription:
                'Limit the access to the REST API to a particular hostname (for CORS-enabled clients such as browsers).',
            },
            eth1ProviderUrl: {
              displayName:
                'One or more Web3 provider URLs used for obtaining deposit contract data.',
              cliConfigPrefix: '--web3-url=',
              defaultValue: '"ws://127.0.0.1:8546"',
              uiControl: {
                type: 'text',
              },
              infoDescription:
                'Urls to Eth1 node with enabled rpc. If not explicity provided and execution endpoint provided via execution.urls, it will use execution.urls. Otherwise will try connecting on the specified default(s)',
              documentation:
                'https://nimbus.guide/web3-backup.html?highlight=--web3-url#add-a-backup-web3-provider',
            },
            maxPeerCount: {
              displayName:
                'Max Peer Count (set to low number to use less bandwidth)',
              cliConfigPrefix: '--max-peers=',
              defaultValue: '160',
              uiControl: {
                type: 'text',
              },
            },
          },
          documentation: {
            default: 'https://nimbus.guide/',
            docker: 'https://nimbus.guide/docker.html',
          },
          iconUrl:
            'https://clientdiversity.org/assets/img/consensus-clients/nimbus-logo-text.png',
        },
        config: {
          configValuesMap: {
            http: 'Enabled',
            httpHostAddress: '0.0.0.0',
            httpCorsDomains: '"http://localhost"',
            eth1ProviderUrl: '"ws://host.docker.internal:8546"',
            dataDir:
              '/Library/Application Support/NiceNode/nodes/nimbus-1667264729',
          },
        },
        runtime: {
          dataDir:
            '/Library/Application Support/NiceNode/nodes/nimbus-1667264729',
          usage: {
            diskGBs: 0.000263848,
            memoryBytes: 0,
            cpuPercent: 0,
          },
          processIds: [
            '62b5b9295aa2ae67d74660f16e58c77f4255b3cd807d2871ec04ca7fe89cb614',
          ],
        },
        status: 'stopped',
        lastStopped: '2022-11-01T01:05:35.62993638Z',
      },
    },
    nodeIds: [
      '86825805-9c48-4667-9473-4df440714b4e',
      'd5f390cb-d48c-46b5-8ae4-b41701bed176',
    ],
  },
};
