import type { ServiceConfigs } from './nodePackageConfig';

export const FilePathControlType = 'filePath';
export type FilePathControl = {
  type: 'filePath';
  // Should only be used by node packages
  serviceConfigs?: ServiceConfigs;
};
export type TextControl = {
  type: 'text';
  // Should only be used by node packages
  serviceConfigs?: ServiceConfigs;
};
export type SelectTranslation = {
  value: string;
  config?: string;

  // Only used for sync modes for now
  info?: string;
  // Should only be used by node packages
  serviceConfigs?: ServiceConfigs;
};
export type SelectControl = {
  type: 'select/single';
  controlTranslations: SelectTranslation[];
};
export type MultiSelectControl = {
  type: 'select/multiple';
  controlTranslations: SelectTranslation[];
};
export type ConfigTranslationControl =
  | FilePathControl
  | SelectControl
  | MultiSelectControl
  | TextControl;

export type ConfigValue = string | string[] | undefined;

export type ConfigTranslationAddNodeFlow = 'required' | 'advanced';

export type ConfigTranslation = {
  displayName: string;
  uiControl: ConfigTranslationControl;
  category?: string;
  cliConfigPrefix?: string | string[];
  valuesJoinStr?: string;
  valuesWrapChar?: string;
  defaultValue?: ConfigValue;
  niceNodeDefaultValue?: ConfigValue;
  documentation?: string;
  infoDescription?: string;
  warning?: string;
  addNodeFlow?: ConfigTranslationAddNodeFlow;
  initCommandConfig?: boolean;
  hideFromUserAfterStart?: boolean;
  isEnvVariable?: boolean;
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
  controlTranslations: SelectTranslation[],
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
  isBuildingEnvInput,
}: {
  configValuesMap: ConfigValuesMap;
  configTranslationMap?: ConfigTranslationMap;
  excludeConfigKeys?: string[];
  isBuildingEnvInput?: boolean;
}): string => {
  if (!configTranslationMap) return '';
  const cliConfigArray = Object.keys(configValuesMap).reduce(
    (cliString, configKey) => {
      const configValue = configValuesMap[configKey];
      const configTranslation: ConfigTranslation =
        configTranslationMap[configKey];

      // Only include env vars if building env input, ignore env vars if building cli input
      if (
        excludeConfigKeys?.includes(configKey) ||
        isBuildingEnvInput !== configTranslation?.isEnvVariable
      ) {
        return cliString;
      }

      if (configTranslation && configValue) {
        let currCliString = '';

        if (configTranslation.cliConfigPrefix) {
          if (typeof configTranslation.cliConfigPrefix === 'string') {
            currCliString = configTranslation.cliConfigPrefix;
          } else if (Array.isArray(configTranslation.cliConfigPrefix)) {
            const [firstCliConfigPrefix] = configTranslation.cliConfigPrefix;
            currCliString = firstCliConfigPrefix;
          }
        }
        if (configTranslation.uiControl.type === 'select/multiple') {
          const joinStr = configTranslation.valuesJoinStr ?? ',';
          const cliConfigs = getConfigFromValue(
            configValue,
            configTranslation.uiControl.controlTranslations,
          );
          let cliConfigJoinedStr = cliConfigs.join(joinStr);
          if (configTranslation.valuesWrapChar) {
            cliConfigJoinedStr =
              configTranslation.valuesWrapChar +
              cliConfigJoinedStr +
              configTranslation.valuesWrapChar;
          }
          currCliString += cliConfigJoinedStr;
        } else if (typeof configValue === 'string') {
          if (configTranslation.uiControl.type === 'select/single') {
            const cliConfigs = getConfigFromValue(
              configValue,
              configTranslation.uiControl.controlTranslations,
            );
            if (cliConfigs.length > 0) {
              currCliString += cliConfigs[0];
            } else {
              console.error(
                `Unable to add config value during buildCliConfig. No configs found for ${configValue}`,
              );
            }
          } else if (configTranslation.uiControl.type === 'filePath') {
            // wrap filePath's in double quotes to support file paths with spaces (macOS requirement)
            currCliString += `"${configValue}"`;
          } else {
            currCliString += configValue;
          }
        } else {
          console.error(
            `Unable to add config value during buildCliConfig. Encountered unknown value type for value ${configValue}`,
          );
        }

        if (
          configTranslation.cliConfigPrefix &&
          Array.isArray(configTranslation.cliConfigPrefix)
        ) {
          for (let i = 1; i < configTranslation.cliConfigPrefix.length; i++) {
            currCliString += ` ${configTranslation.cliConfigPrefix[i]}${configValue}`;
          }
        }
        // each env var needs to be prefixed with -e for podman/docker
        if (isBuildingEnvInput) {
          currCliString = `-e ${currCliString}`;
        }

        console.log(
          'cliString, currCliString: ',
          JSON.stringify(cliString),
          JSON.stringify(currCliString),
        );

        // join the current config with the previous and a space between
        if (cliString) {
          return `${cliString} ${currCliString}`;
        }
        return currCliString;
      }
      return cliString;
    },
    '',
  );
  return cliConfigArray;
};

export const buildEnvInput = (input: string) => {
  if (!input) {
    return '';
  }
  const pairs = input.split(',');
  return pairs.map((pair) => `-e ${pair.trim()}`).join(' ');
};
