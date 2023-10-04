import { NodePackageSpecification } from '../../common/nodeSpec';
import { mergePackageAndClientConfigValues } from '../../renderer/Presentational/AddNodeConfiguration/mergePackageAndClientConfigValues';

const nodePackageSpec = {
  specId: 'ethereum',
  version: '1.0.0',
  displayName: 'Ethereum',
  displayTagline: 'Non-Validating Node - Ethereum',
  execution: {
    executionTypes: ['nodePackage'],
    defaultExecutionType: 'nodePackage',
    services: [
      {
        serviceId: 'executionClient',
        name: 'Execution Client',
        nodeOptions: ['nethermind', 'besu', 'geth', 'reth'],
        required: true,
        requiresCommonJwtSecret: true,
      },
      {
        serviceId: 'consensusClient',
        name: 'Consensus Client',
        nodeOptions: [
          'lodestar-beacon',
          'teku-beacon',
          'prysm-beacon',
          'lighthouse-beacon',
          'nimbus-beacon',
        ],
        required: true,
        requiresCommonJwtSecret: true,
      },
    ],
  },
  category: 'L1',
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
      displayName: 'Node data is stored in this folder',
      cliConfigPrefix: '--datadir ',
      defaultValue: '~/.ethereum',
      uiControl: {
        type: 'filePath',
        serviceConfigs: {
          services: [
            {
              serviceId: 'executionClient',
              configKey: 'dataDir',
            },
            {
              serviceId: 'consensusClient',
              configKey: 'dataDir',
            },
          ],
        },
      },
      infoDescription:
        'Data directory for the databases and keystore (default: "~/.ethereum")',
    },
    network: {
      displayName: 'Network (Ethereum node)',
      addNodeFlow: 'required',
      defaultValue: 'Mainnet',
      hideFromUserAfterStart: true,
      uiControl: {
        type: 'select/single',
        controlTranslations: [
          {
            value: 'Mainnet',
            config: 'unused in nodespec',
            serviceConfigs: {
              services: [
                {
                  serviceId: 'executionClient',
                  configValues: {
                    network: 'Mainnet',
                  },
                },
                {
                  serviceId: 'consensusClient',
                  configValues: {
                    network: 'Mainnet',
                  },
                },
              ],
            },
          },
          {
            value: 'Sepolia',
            config: 'unused in nodespec',
            serviceConfigs: {
              services: [
                {
                  serviceId: 'executionClient',
                  configValues: {
                    network: 'Sepolia',
                  },
                },
                {
                  serviceId: 'consensusClient',
                  configValues: {
                    network: 'Sepolia',
                  },
                },
              ],
            },
          },
        ],
      },
      documentation:
        'https://ethereum.org/en/developers/docs/networks/#public-networks',
    },
  },
  iconUrl: 'https://ethereum.png',
  addNodeDescription:
    'Running a full etherum node is a two part story. Choosing minority clients are important for the health of the network.',
  description:
    "An Ethereum node holds a copy of the Ethereum blockchain and verifies the validity of every block, keeps it up-to-date with new blocks and thelps others to download and update their own copies of the chain. In the case of Ethereum a node consists of two parts: the execution client and the consensus client. These two clients work together to verify Ethereum's state. The execution client listens to new transactions broadcasted in the network, executes them in EVM, and holds the latest state and database of all current Ethereum data. The consensus client runs the Proof-of-Stake consensus algorithm, which enables the network to achieve agreement based on validated data from the execution client.  A non-validating node does not get financial rewards but there are many benefits of running a node for any Ethereum user to consider, including privacy, security, reduced reliance on third-party servers, censorship resistance and improved health and decentralization of the network.",
} as NodePackageSpecification;
const data = {
  nodePackageSpec,
  nodePackageConfigValues: {
    network: 'Sepolia',
  },
  clientConfigValues: {},
  serviceId: 'executionClient',
};

describe('Testing merge package and client config values', () => {
  it('Successfully merges a single network select value with no client values', async () => {
    const result1 = mergePackageAndClientConfigValues(data);

    expect(result1).toEqual({ network: 'Sepolia' });
  });
  it('Successfully merges a single text value with no client values', async () => {
    const result1 = mergePackageAndClientConfigValues({
      ...data,
      nodePackageConfigValues: {
        dataDir: '/test/dir',
      },
    });

    expect(result1).toEqual({ dataDir: '/test/dir' });
  });

  it('Successfully merges a single network select value with other client values', async () => {
    const result1 = mergePackageAndClientConfigValues({
      ...data,
      clientConfigValues: { someotherthing: 'thin1' },
    });

    expect(result1).toEqual({ network: 'Sepolia', someotherthing: 'thin1' });
  });
  it('Successfully merges a single text value with other client values', async () => {
    const result1 = mergePackageAndClientConfigValues({
      ...data,
      nodePackageConfigValues: {
        dataDir: '/test/dir',
      },
      clientConfigValues: {
        someotherthing: 'thin1',
      },
    });

    expect(result1).toEqual({ dataDir: '/test/dir', someotherthing: 'thin1' });
  });

  it('Successfully merges a single network select value that overrides a client value', async () => {
    const result1 = mergePackageAndClientConfigValues({
      ...data,
      clientConfigValues: {
        network: 'clientNetworkHowdThisHappen',
        someotherthing: 'thin1',
      },
    });

    expect(result1).toEqual({ network: 'Sepolia', someotherthing: 'thin1' });
  });
  it('Successfully merges a single text value that overrides a client value', async () => {
    const result1 = mergePackageAndClientConfigValues({
      ...data,
      nodePackageConfigValues: {
        dataDir: '/test/dir',
      },
      clientConfigValues: {
        dataDir: '/other/client/dir/howd/this/happen',
        someotherthing: 'thin1',
      },
    });

    expect(result1).toEqual({ dataDir: '/test/dir', someotherthing: 'thin1' });
  });
});
