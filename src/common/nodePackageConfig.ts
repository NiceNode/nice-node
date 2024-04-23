import type { ConfigKey, ConfigValuesMap } from './nodeConfig';

/**
 * "serviceConfigs": {
    "services": [
      {
        "serviceId": "executionClient",
        "configValues": {
          "network": "Mainnet",
          "genesisFile": ""
        }
      },
      {
        "serviceId": "consensusClient",
        "configValues": {
          "network": "Mainnet"
        }
      }
    ]
  }
 */
export type ServiceConfigs = {
  services: {
    serviceId: string;
    configKey?: ConfigKey; // used for text type controls
    configValues?: ConfigValuesMap; // used for select controls
  }[];
  // clientExceptionConfigValues?: {
  //   cliendId: string;
  //   configValues: ConfigValuesMap;
  // }[];
};
