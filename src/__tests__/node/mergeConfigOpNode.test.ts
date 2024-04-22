import { describe, expect, it } from 'vitest';
import type { NodePackageSpecification } from '../../common/nodeSpec';
import { mergePackageAndClientConfigValues } from '../../renderer/Presentational/AddNodeConfiguration/mergePackageAndClientConfigValues';

const nodePackageSpec = {
  specId: 'optimism',
  version: '1.0.0',
  displayName: 'Optimism',
  displayTagline: 'Ethereum L2 - Optimism',
  execution: {
    executionTypes: ['nodePackage'],
    services: [
      {
        serviceId: 'executionClient',
        name: 'Execution Client',
        nodeOptions: ['op-geth', 'nethermind'],
        required: true,
        requiresCommonJwtSecret: true,
        requiresFiles: true,
      },
      {
        serviceId: 'consensusClient',
        name: 'Consensus Client',
        nodeOptions: ['op-node'],
        required: true,
        requiresCommonJwtSecret: true,
        requiresFiles: true,
      },
    ],
    dependencies: [
      {
        name: 'Ethereum node',
        specId: 'ethereum',
      },
    ],
  },
  category: 'Ethereum/L2',
  rpcTranslation: 'eth-l2-op-stack',
  systemRequirements: {
    documentationUrl: 'https://geth.ethereum.org/docs/interface/hardware',
    cpu: {
      cores: 4,
    },
    memory: {
      minSizeGBs: 16,
    },
    storage: {
      minSizeGBs: 200,
      ssdRequired: true,
    },
    internet: {
      minDownloadSpeedMbps: 25,
      minUploadSpeedMbps: 10,
    },
  },
  configTranslation: {
    network: {
      displayName: 'Network',
      defaultValue: 'Sepolia',
      addNodeFlow: 'required',
      uiControl: {
        type: 'select/single',
        controlTranslations: [
          {
            value: 'Sepolia',
            config: 'unused in nodespec',
            serviceConfigs: {
              services: [
                {
                  serviceId: 'executionClient',
                  configValues: {
                    genesisFile: 'sepolia-genesis-l2.json',
                    rollupSequencerHttpEndpoint:
                      'https://sepolia-sequencer.optimism.io/',
                    chainId: '11155420',
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
          {
            value: 'Mainnet',
            config: 'unused in nodespec',
            serviceConfigs: {
              services: [
                {
                  serviceId: 'executionClient',
                  configValues: {
                    genesisFile: 'genesis-l2.json',
                    rollupSequencerHttpEndpoint:
                      'https://sequencer.optimism.io/',
                    chainId: '10',
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
        ],
      },
      infoDescription: 'Mainnet support coming soon',
    },
  },
  iconUrl: 'https://ethereum.png',
  addNodeDescription:
    'OP Mainnet is a fast, stable, and scalable L2 blockchain built by Ethereum developers, for Ethereum developers.',
  description:
    "Optimism is a secure, low-cost, developer-friendly Ethereum L2 built to bring the next billion users onchain. It's built on Optimism’s open-source OP Stack.",
  documentation: {
    default: 'https://docs.optimism.org/guides/run-a-optimism-node/',
  },
} as NodePackageSpecification;

const data = {
  nodePackageSpec,
  nodePackageConfigValues: {
    network: 'Mainnet',
  },
  clientConfigValues: {},
  serviceId: 'executionClient',
};

describe('Testing merge package and client config values', () => {
  it('Successfully merges config with chainId by excluding network from the results', async () => {
    const result1 = mergePackageAndClientConfigValues(data);

    expect(result1).toEqual({
      genesisFile: 'genesis-l2.json',
      rollupSequencerHttpEndpoint: 'https://sequencer.optimism.io/',
      chainId: '10',
    });
  });
});
