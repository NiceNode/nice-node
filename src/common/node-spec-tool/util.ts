export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Simple json.stringify comparison of two objects
 */
export function compareObjects(obj1: any, obj2: any) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export const gethv1 = {
  specId: 'geth',
  version: '1.0.0',
  displayName: 'Geth',
  execution: {
    executionTypes: ['docker'],
    defaultExecutionType: 'docker',
    input: {
      defaultConfig: {
        http: 'Enabled',
        httpCorsDomains: 'http://localhost',
        webSockets: 'Disabled',
        httpVirtualHosts: 'localhost,host.containers.internal',
        authVirtualHosts: 'localhost,host.containers.internal',
        httpAddress: '0.0.0.0',
        webSocketAddress: '0.0.0.0',
        syncMode: 'snap',
      },
      docker: {
        containerVolumePath: '/root/.ethereum',
        raw: '',
        forcedRawNodeInput:
          '--authrpc.addr 0.0.0.0 --authrpc.jwtsecret /root/.ethereum/jwtsecret --ipcdisable',
      },
    },
    imageName: 'docker.io/ethereum/client-go',
    defaultImageTag: 'stable',
  },
  category: 'L1/ExecutionClient',
  rpcTranslation: 'eth-l1',
  systemRequirements: {
    documentationUrl: 'https://geth.ethereum.org/docs/interface/hardware',
    cpu: {
      cores: 4,
    },
    memory: {
      minSizeGBs: 16,
    },
    storage: {
      minSizeGBs: 1600,
      ssdRequired: true,
    },
    internet: {
      minDownloadSpeedMbps: 25,
      minUploadSpeedMbps: 10,
    },
    docker: {
      required: true,
    },
  },
  configTranslation: {
    dataDir: {
      displayName: 'Data location',
      cliConfigPrefix: '--datadir ',
      defaultValue: '~/.ethereum',
      uiControl: {
        type: 'filePath',
      },
      infoDescription:
        'Data directory for the databases and keystore (default: "~/.ethereum")',
    },
    network: {
      displayName: 'Network',
      defaultValue: 'Mainnet',
      hideFromUserAfterStart: true,
      uiControl: {
        type: 'select/single',
        controlTranslations: [
          {
            value: 'Mainnet',
            config: '--mainnet',
          },
          {
            value: 'Holesky',
            config: '--holesky',
          },
          {
            value: 'Sepolia',
            config: '--sepolia',
          },
        ],
      },
    },
    webSocketsPort: {
      displayName: 'WebSockets JSON-RPC port',
      cliConfigPrefix: '--ws.port ',
      defaultValue: '8546',
      uiControl: {
        type: 'text',
      },
      infoDescription:
        'The port (TCP) on which WebSocket JSON-RPC listens. The default is 8546. You must expose ports appropriately.',
      documentation:
        'https://geth.ethereum.org/docs/rpc/server#websocket-server',
    },
    webSocketApis: {
      displayName: 'Enabled WebSocket APIs',
      cliConfigPrefix: '--ws.api ',
      defaultValue: ['eth', 'net', 'web3'],
      valuesJoinStr: ',',
      uiControl: {
        type: 'select/multiple',
        controlTranslations: [
          {
            value: 'eth',
            config: 'eth',
          },
          {
            value: 'net',
            config: 'net',
          },
          {
            value: 'web3',
            config: 'web3',
          },
          {
            value: 'debug',
            config: 'debug',
          },

          {
            value: 'personal',
            config: 'personal',
          },
          {
            value: 'admin',
            config: 'admin',
          },
        ],
      },
    },
    syncMode: {
      displayName: 'Execution Client Sync Mode',
      category: 'Syncronization',
      uiControl: {
        type: 'select/single',
        controlTranslations: [
          {
            value: 'snap',
            config: '--syncmode snap',
            info: '',
          },
          {
            value: 'full',
            config: '--syncmode full',
            info: '~800GB / ~2d',
          },
          {
            value: 'archive',
            config: '--syncmode full --gcmode archive',
            info: '~16TB',
          },
        ],
      },
      addNodeFlow: 'required',
      defaultValue: 'snap',
      hideFromUserAfterStart: true,
      documentation:
        'https://geth.ethereum.org/docs/faq#how-does-ethereum-syncing-work',
    },
  },
  iconUrl:
    'https://clientdiversity.org/assets/img/execution-clients/geth-logo.png',
};
