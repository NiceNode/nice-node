import type {
  NodeSpecification,
  DockerExecution as PodmanExecution,
} from '../nodeSpec.js';

/**
 * Injects default controller configuration (cliInput, serviceVersion, etc.)
 * into the nodeSpec. It does NOT overwrite existing values.
 * Always updated is the default serviceVersion value to spec.excution.defaultImageTag
 * For example, if `cliInput` is defined, it does NOT get overwritten.
 * @param nodeSpec
 */
export const injectDefaultControllerConfig = (nodeSpec: NodeSpecification) => {
  // "inject" serviceVersion and dataDir (todo) here. Universal for all nodes.
  const execution = nodeSpec.execution as PodmanExecution;
  let defaultImageTag = 'latest';
  // if the defaultImageTag is set in the spec use that, otherwise 'latest'
  if (execution.defaultImageTag !== undefined) {
    defaultImageTag = execution.defaultImageTag;
  }

  if (!nodeSpec.configTranslation) {
    nodeSpec.configTranslation = {};
  }

  if (!nodeSpec.configTranslation.cliInput) {
    nodeSpec.configTranslation.cliInput = {
      displayName: `${nodeSpec.displayName} CLI input`,
      uiControl: {
        type: 'text',
      },
      defaultValue: '',
      addNodeFlow: 'advanced',
      infoDescription: 'Additional CLI input',
    };
  }
  if (!nodeSpec.configTranslation.serviceVersion) {
    nodeSpec.configTranslation.serviceVersion = {
      displayName: `${nodeSpec.displayName} version`,
      uiControl: {
        type: 'text',
      },
      defaultValue: defaultImageTag,
      addNodeFlow: 'advanced',
      infoDescription:
        'Possible values: latest, v1.0.0, or stable. Check service documenation.',
    };
  }

  // always update the default serviceVersion value to the latest excution.defaultImageTag
  nodeSpec.configTranslation.serviceVersion.defaultValue = defaultImageTag;
};
