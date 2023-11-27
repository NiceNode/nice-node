import { Meta } from '@storybook/react';
import { ConfigValuesMap } from '../../common/nodeConfig';

import DynamicSettings, {
  CategoryConfig,
} from '../../renderer/Generics/redesign/DynamicSettings/DynamicSettings';

export default {
  title: 'Generic/DynamicSettings',
  component: DynamicSettings,
} as Meta<typeof DynamicSettings>;

const configValuesMap: ConfigValuesMap = {
  dataDir:
    '/Users/johns/Library/Application Support/NiceNode/nodes/besu-1667947772',
  hostAllowlist: 'localhost,host.containers.internal',
  http: 'Enabled',
  httpCorsDomains: '"http://localhost"',
  webSockets: 'Disabled',
};

const categoryConfigs: CategoryConfig[] = [
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
      },
      dataStorageFormat: {
        displayName: "Besu's data storage format",
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
        displayName: 'Execution Client Sync Mode',
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
      },
    },
  },
  {
    category: 'RPC APIs',
    configTranslationMap: {
      http: {
        displayName: 'RPC http connections',
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
      },
      webSockets: {
        displayName: 'RPC websocket connections',
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
      },
      webSocketsPort: {
        displayName: 'WebSockets RPC listening port',
        cliConfigPrefix: '--rpc-ws-port=',
        defaultValue: '8546',
        uiControl: {
          type: 'text',
        },
      },
      httpApis: {
        displayName: "Enabled HTTP API's",
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
      },
      hostAllowList: {
        displayName: 'RPC connections accepted by node',
        category: 'RPC APIs',
        cliConfigPrefix: '--host-allowlist=',
        uiControl: {
          type: 'text',
        },
        infoDescription:
          'A comma-separated list of hostnames to access the JSON-RPC API and pull Besu metrics. By default, Besu accepts requests from localhost and 127.0.0.1. Example value: medomain.com,meotherdomain.com',
        defaultValue: 'localhost,127.0.0.1',
      },
    },
  },
  {
    category: 'Other',
    configTranslationMap: {
      httpCorsDomains: {
        displayName: 'Allowed virtual hostnames for inbound requests',
        cliConfigPrefix: '--rpc-http-cors-origins=',
        valuesJoinStr: ',',
        uiControl: {
          type: 'text',
        },
        documentation:
          'https://besu.hyperledger.org/en/stable/public-networks/reference/cli/options/#rpc-http-cors-origins',
        infoDescription:
          'Change where the node accepts http connections (use comma separated urls wrapped in double quotes). If using a browser wallet, the extension url is required to be input here.',
      },
      maxPeerCount: {
        displayName: 'Max Peer Count (set to low number to use less bandwidth)',
        cliConfigPrefix: '--max-peers=',
        defaultValue: '25',
        uiControl: {
          type: 'text',
        },
      },
    },
  },
];

export const Primary = {
  args: {
    categoryConfigs,
    configValuesMap,
  },
};
