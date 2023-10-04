import { ConfigValuesMap } from 'common/nodeConfig';
import { NodePackageSpecification } from '../../../common/nodeSpec';

export type ConfigMergeArgs = {
  nodePackageSpec: NodePackageSpecification;
  serviceId: string;
  nodePackageConfigValues?: ConfigValuesMap;
  clientConfigValues?: ConfigValuesMap;
};

/**
 * Referring to this data structure set at the Node Package Level will help in visualizing the merge
 *
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
    ],
    "clientExceptionConfigValues": [
      {
        "clientId": "geth",
        "configValues": {
          "network": "MaInNeT"
        }
      }
    ]
  }
 */

/**
 * This function takes initial config settings at the node package level and
 * merges them with initial config at the node service/client level.
 * Values at the node package level will override the service/client level.
 * A simple merge object cannot be done because a single config change at the package level
 * may change one or more configs at the service/client level.
 * @param nodePackageSpec
 * @param nodePackageConfigValues
 * @param clientConfigValues
 */
export const mergePackageAndClientConfigValues = (
  mergeArgs: ConfigMergeArgs,
) => {
  console.log('mergePackageAndClientConfigValues mergeArgs: ', mergeArgs);
  const {
    nodePackageSpec,
    serviceId,
    nodePackageConfigValues,
    clientConfigValues,
  } = mergeArgs;

  let mergedConfigValues: ConfigValuesMap = { ...clientConfigValues };
  // for each packge config, look in the spec for the corresponding service configs to set
  if (nodePackageConfigValues) {
    // For each initial package setting...

    Object.entries(nodePackageConfigValues).forEach((entry) => {
      const [configKey, configValue] = entry;
      console.log('nodePackageConfigValues: ', nodePackageConfigValues);
      // Find the package specification translation for the setting...
      const configTranslation = nodePackageSpec.configTranslation?.[configKey];
      console.log('configTranslation: ', configTranslation);
      if (configTranslation) {
        let serviceConfigs;
        if (
          configTranslation.uiControl.type !== 'select/single' &&
          configTranslation.uiControl.type !== 'select/multiple'
        ) {
          // eslint
          serviceConfigs = configTranslation.uiControl?.serviceConfigs;
        } else {
          // find value in the select options which contains the serviceConfigs
          if (!configTranslation.uiControl.controlTranslations) {
            console.error(
              'configTranslation.uiControl.controlTranslations is undefined: ',
              configTranslation.uiControl.controlTranslations,
            );
          }
          const selectedSelectTranslation =
            configTranslation.uiControl.controlTranslations.find(
              (translation) => translation.value === configValue,
            );
          if (selectedSelectTranslation) {
            serviceConfigs = selectedSelectTranslation.serviceConfigs;
          }
        }
        if (serviceConfigs) {
          console.log('serviceConfigs: ', serviceConfigs);
          // And for that setting, find the values for the specific service/client
          // if defined, find the client specific configs to set
          if (!serviceConfigs.services) {
            console.error(
              'serviceConfigs.services is undefined: ',
              serviceConfigs.services,
            );
          }
          const serviceConfig = serviceConfigs.services.find(
            (serviceConfig) => serviceConfig.serviceId === serviceId,
          );
          if (serviceConfig) {
            let matchingConfigValues: ConfigValuesMap = {};
            if (serviceConfig.configValues) {
              // a node package select control was used, multiple values could be set
              matchingConfigValues = serviceConfig.configValues;
            } else if (serviceConfig.configKey !== undefined) {
              // a text type control was used, just set to the single value at package level
              matchingConfigValues[serviceConfig.configKey] = configValue;
            }
            console.log('matchingConfigValues: ', matchingConfigValues);
            // package values override service/client values
            mergedConfigValues = {
              ...mergedConfigValues,
              ...matchingConfigValues,
            };
            console.log('just merged mergedConfigValues: ', mergedConfigValues);
          }
        }
      }
    });
  }

  console.log('mergePackageAndClientConfigValues return: ', mergedConfigValues);
  return mergedConfigValues;
};
