import type {
  ConfigValuesMap,
  SelectControl,
  SelectTranslation,
} from '../nodeConfig.js';
import type { NodeSpecification } from '../nodeSpec.js';

// Todo: ConfigValuesMap in nodeConfig.ts needs updated with string[] type
// export type ConfigValuesMap = Record<string, string | string[]>;

/**
 *  // Iterate over current controller config
    // If the key is not in the new spec controls, delete it from the config
    //  if the key is in the new spec, keep it OR
    //      if it is a select control, keep it ONLY if it is in the new spec's value options.
    //      if it is not in the options, delete the key from the config.
    // If the key exists but the type changes, delete the key from the config. (should we do?)

    // Special cases: `serviceVersion` is updated to the spec's execution.defaultImageTag

    This function should be run AFTER injectDefaultControllerConfig() is called on the newSpec.

    // Todo: New required config? notify user after or before update?
 * @param newSpec
 * @param currentControllerConfig
 * @returns
 */
export const calcNewControllerConfig = (
  newSpec: NodeSpecification,
  currentControllerConfig: ConfigValuesMap,
): ConfigValuesMap => {
  const newControllerConfig: ConfigValuesMap = {};
  const newTranslations = newSpec.configTranslation ?? {};
  const newTranslationKeys = Object.keys(newTranslations);

  for (const [key, value] of Object.entries(currentControllerConfig)) {
    console.log(`Current Controller Config:: ${key}: ${value}`);
    if (newTranslationKeys.includes(key)) {
      if (newTranslations[key]?.uiControl?.type.includes('select')) {
        const newSelectOptions = (
          newTranslations[key].uiControl as SelectControl
        )?.controlTranslations as SelectTranslation[];
        if (newTranslations[key]?.uiControl?.type === 'select/multiple') {
          // Only keep values that are in the new controller options
          if (Array.isArray(value)) {
            const valuesToKeep = [];
            for (const val in value) {
              const isFound = newSelectOptions.find((option) => {
                // if the option.config does
                return option.value === val;
              });
              if (isFound) {
                valuesToKeep.push(val);
              }
            }
            if (valuesToKeep.length > 0) {
              newControllerConfig[key] = valuesToKeep;
            }
          } else {
            console.error(
              `Value for multi select should be an array. key: ${key} value: ${value}`,
            );
          }
        } else {
          // single select
          // make sure current value is in the new options
          if (typeof value === 'string') {
            if (
              newSelectOptions.map((option) => option.value).includes(value)
            ) {
              newControllerConfig[key] = value;
            }
          } else {
            console.error(
              `Value for single select should be a string. key: ${key} value: ${value}`,
            );
          }
        }
      } else {
        // Non-select control, no validation required when updating
        newControllerConfig[key] = value;
      }
    } else {
      console.log(
        `Current Controller Config key NOT found :: ${key}: ${value}`,
      );
    }
  }
  //// end loop over currentControllerConfig's key, values

  return newControllerConfig;
};
