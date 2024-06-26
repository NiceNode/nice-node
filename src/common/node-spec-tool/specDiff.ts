import type { SelectControl, SelectTranslation } from '../nodeConfig.js';
import type { DockerExecution, NodeSpecification } from '../nodeSpec.js';
import { assert, compareObjects } from './util.js';

export type UserSpecDiff = {
  message: string;
};

// Only time a user default would be overridden is if the user default is not in the new spec as
// an option on a select config. In that case, the default should be used. So we should highlight any
// removal of select options.
// returns a list of changes
export const calcUserSpecDiff = (
  oldSpec: NodeSpecification,
  newSpec: NodeSpecification,
): UserSpecDiff[] => {
  assert(oldSpec.specId === newSpec.specId, 'specId mismatch');
  assert(
    oldSpec.version < newSpec.version,
    'newSpec version is not greater than oldSpec version',
  );

  const diffs: UserSpecDiff[] = [];
  diffs.push({
    message: `Controller version: ${oldSpec.version} -> ${newSpec.version}`,
  });
  if (oldSpec.displayName !== newSpec.displayName) {
    diffs.push({
      message: `Name: ${oldSpec.displayName} -> ${newSpec.displayName}`,
    });
  }

  /////// [start] Execution
  const oldSpecExecution = oldSpec.execution as DockerExecution;
  const newSpecExecution = newSpec.execution as DockerExecution;
  if (oldSpecExecution.imageName !== newSpecExecution.imageName) {
    diffs.push({
      message: `Download URL: ${oldSpecExecution.imageName} -> ${newSpecExecution.imageName}`,
    });
  }
  if (oldSpecExecution.defaultImageTag !== newSpecExecution.defaultImageTag) {
    diffs.push({
      message: `Version: ${oldSpecExecution.defaultImageTag} -> ${newSpecExecution.defaultImageTag}`,
    });
  }
  /////// [end] Execution

  /////// [start] System Requirements
  const oldSysReq = oldSpec.systemRequirements;
  const newSysReq = newSpec.systemRequirements;
  if (!compareObjects(oldSysReq, newSysReq)) {
    let oldSysReqString = '';
    let newSysReqString = '';
    if (!compareObjects(oldSysReq?.cpu, newSysReq?.cpu)) {
      oldSysReqString += ` CPU: ${JSON.stringify(oldSysReq?.cpu)}`;
      newSysReqString += ` CPU: ${JSON.stringify(newSysReq?.cpu)}`;
    }
    if (!compareObjects(oldSysReq?.memory, newSysReq?.memory)) {
      oldSysReqString += ` Memory: ${JSON.stringify(oldSysReq?.memory)}`;
      newSysReqString += ` Memory: ${JSON.stringify(newSysReq?.memory)}`;
    }
    if (!compareObjects(oldSysReq?.storage, newSysReq?.storage)) {
      oldSysReqString += ` Storage: ${JSON.stringify(oldSysReq?.storage)}`;
      newSysReqString += ` Storage: ${JSON.stringify(newSysReq?.storage)}`;
    }
    if (!compareObjects(oldSysReq?.internet, newSysReq?.internet)) {
      oldSysReqString += ` Internet: ${JSON.stringify(oldSysReq?.internet)}`;
      newSysReqString += ` Internet: ${JSON.stringify(newSysReq?.internet)}`;
    }

    diffs.push({
      message: `System requirements: ${oldSysReqString} -> ${newSysReqString}`,
    });
  }
  /////// [end] System Requirements

  /////// [start] Config Tralsations
  const oldTranslations = oldSpec.configTranslation ?? {};
  const newTranslations = newSpec.configTranslation ?? {};
  const oldTranslationKeys = Object.keys(oldTranslations);
  const newTranslationKeys = Object.keys(newTranslations);
  for (const key of oldTranslationKeys) {
    if (!newTranslationKeys.includes(key)) {
      diffs.push({
        message: `Removed setting: ${oldTranslations[key]?.displayName}`,
      });
    } else {
      if (oldTranslations[key]?.uiControl?.type.includes('select')) {
        const oldSelectOptions = (
          oldTranslations[key].uiControl as SelectControl
        )?.controlTranslations as SelectTranslation[];
        const newSelectOptions = (
          newTranslations[key].uiControl as SelectControl
        )?.controlTranslations as SelectTranslation[];
        if (!compareObjects(oldSelectOptions, newSelectOptions)) {
          diffs.push({
            message: `Changed setting options: ${JSON.stringify(
              oldSelectOptions,
            )} -> ${JSON.stringify(newSelectOptions)}`,
          });
        }
      }

      // else, they're the same
    }
  }
  for (const key of newTranslationKeys) {
    if (!oldTranslationKeys.includes(key)) {
      diffs.push({
        message: `New setting: ${newTranslations[key]?.displayName}`,
      });
    }
    // else, they were compared when iterating over oldTranslationKeys
  }
  /////// [end] Config Tralsations

  return diffs;
};
