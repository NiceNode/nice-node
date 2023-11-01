import { Meta } from '@storybook/react';
import { ConfigValuesMap } from '../../common/nodeConfig';

import NodeSettings from '../../renderer/Presentational/NodeSettings/NodeSettings';

export default {
  title: 'Presentational/NodeSettings',
  component: NodeSettings,
} as Meta<typeof NodeSettings>;

const configValuesMap: ConfigValuesMap = {
  dataDir:
    '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1667947772',
  hostAllowlist: 'localhost,host.containers.internal',
  http: 'Enabled',
  httpCorsDomains: '"http://localhost"',
  webSockets: 'Disabled',
};

export const Primary = {
  args: {
    configValuesMap,
    categoryConfigs: [
      {
        category: 'Storage',
        configTranslationMap: {
          dataDir: {
            displayName: 'Data location',
            category: 'Storage',
            cliConfigPrefix: '--data-path=',
            uiControl: {
              type: 'filePath',
            },
            documentation:
              'https://besu.hyperledger.org/en/stable/Reference/CLI/CLI-Syntax/#data-path',
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
        },
      },
      {
        category: 'Syncronization',
        configTranslationMap: {
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
        },
      },
      {
        category: 'RPC APIs',
        configTranslationMap: {
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
        },
      },
      {
        category: 'Other',
        configTranslationMap: {
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
            displayName: 'The port (TCP) on which WebSocket JSON-RPC listens.',
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
      },
    ],
  },
};
