type FilePathControl = {
  type: 'filePath';
};
type TextControl = {
  type: 'text';
};
type SelectTranslation = { value: string; config?: string };
type SelectControl = {
  type: 'select/single';
  controlTranslations: SelectTranslation[];
};
type MultiSelectControl = {
  type: 'select/multiple';
  controlTranslations: SelectTranslation[];
};
export type ConfigTranslationControl =
  | FilePathControl
  | SelectControl
  | MultiSelectControl
  | TextControl;

export type ConfigTranslation = {
  displayName: string;
  uiControl: ConfigTranslationControl;
  category?: string;
  cliConfigPrefix?: string;
  valuesJoinStr?: string;
  defaultValue?: string;
  documentation?: string;
  infoDescription?: string;
};

export type ConfigKey = string;
export type ConfigValuesMap = Record<ConfigKey, string>;
export type ConfigTranslationMap = Record<ConfigKey, ConfigTranslation>;

/**
 * Returns cli config for the node config values using the config
 * translations provide in the node spec
 * @param configValue
 * @param controlTranslations
 * @returns
 */
const getConfigFromValue = (
  configValue: string | string[],
  controlTranslations: SelectTranslation[]
) => {
  const matchedControlTranslations = controlTranslations.filter((option) => {
    return (
      ((Array.isArray(configValue) && configValue.includes(option.value)) ||
        configValue === option.value) &&
      option.config !== undefined
    );
  });
  return matchedControlTranslations.map((option) => option.config);
};

/**
 * Exclude config keys is used when starting a node with docker and avoiding
 * using the dataDir key because the dataDir key is used for the docker volume mount.
 * @param param0
 * @returns
 */
export const buildCliConfig = ({
  configValuesMap,
  configTranslationMap,
  excludeConfigKeys,
}: {
  configValuesMap: ConfigValuesMap;
  configTranslationMap?: ConfigTranslationMap;
  excludeConfigKeys?: string[];
}): string => {
  if (!configTranslationMap) return '';
  const cliConfigArray = Object.keys(configValuesMap).reduce(
    (cliString, configKey) => {
      if (excludeConfigKeys?.includes(configKey)) {
        return cliString;
      }
      const configValue = configValuesMap[configKey];
      const configTranslation: ConfigTranslation =
        configTranslationMap[configKey];

      if (configTranslation && configValue) {
        let currCliString = '';
        if (configTranslation.cliConfigPrefix) {
          currCliString = configTranslation.cliConfigPrefix;
        }
        if (configTranslation.uiControl.type === 'select/multiple') {
          const joinStr = configTranslation.valuesJoinStr ?? ',';
          const cliConfigs = getConfigFromValue(
            configValue,
            configTranslation.uiControl.controlTranslations
          );
          currCliString += cliConfigs.join(joinStr);
        } else if (typeof configValue === 'string') {
          if (configTranslation.uiControl.type === 'select/single') {
            const cliConfigs = getConfigFromValue(
              configValue,
              configTranslation.uiControl.controlTranslations
            );
            if (cliConfigs.length > 0) {
              currCliString += cliConfigs[0];
            } else {
              console.error(
                `Unable to add config value during buildCliConfig. No configs found for ${configValue}`
              );
            }
          } else {
            currCliString += configValue;
          }
        } else {
          console.error(
            `Unable to add config value during buildCliConfig. Encountered unknown value type for value ${configValue}`
          );
        }

        console.log(
          'cliString, currCliString: ',
          JSON.stringify(cliString),
          JSON.stringify(currCliString)
        );
        // join the current config with the previous and a space between
        if (cliString) {
          return `${cliString} ${currCliString}`;
        }
        return currCliString;
      }
      return cliString;
    },
    ''
  );
  return cliConfigArray;
};
// return cliConfigArray.join(" ")
/// EXAMPLEEEEEEES

// network: // | {
//     values: ['mainnet', 'goerli', 'ropsten'];
//     default: 'mainnet';
//     config: ['--network']; //lighthouse
//   }
// |
// {
//   displayName: 'Ethereum network';
//   defaultValue: 'mainnet';
//   translation: [
//     //geth
//     {
//       value: 'mainnet';
//       config: ['--mainnet'];
//     },
//     {
//       value: 'kiln';
//       config: ['--kiln'];
//     },
//     {
//       value: 'goerli';
//       config: ['--goerli'];
//     }
//   ];
// };
// syncMode: {
//   displayName: 'Node sync mode';
//   defaultValue: 'snap';
//   translation: [
//     //geth
//     {
//       value: 'snap';
//       config: ['--syncmode', 'snap'];
//     },
//     {
//       value: 'fast';
//       config: ['--syncmode', 'fast'];
//     },
//     {
//       value: 'light';
//       config: ['--syncmode', 'light'];
//     }
//   ];
// };
