import {
  ConfigKey,
  ConfigTranslation,
  ConfigTranslationControl,
  ConfigValuesMap,
} from './nodeConfig';

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

// export type NodePackageControl = ConfigTranslationControl & {
//   serviceConfigs?: ServiceConfigs;
// };
// // modifies only the uiControl property of a normal node ConfigTranslation
// export type NodePackageConfigTranslation = ConfigTranslation & {
//   uiControl: NodePackageControl;
// };

// export type NodePackageConfigTranslationMap = Record<
//   ConfigKey,
//   NodePackageConfigTranslation
// >;
