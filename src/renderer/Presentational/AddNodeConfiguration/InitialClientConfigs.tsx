import React, { Dispatch, useEffect, useReducer, useState } from 'react';
import { NodeSpecification } from '../../../common/nodeSpec';
import DynamicSettings from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import {
  ConfigTranslationAddNodeFlow,
  ConfigTranslationMap,
  ConfigValue,
  ConfigValuesMap,
} from '../../../common/nodeConfig';
import { initialClientConfigContainer } from './addNodeConfiguration.css';
import { mergeObjectReducer } from './deepMerge';

// The core data structure for this component
export type ClientConfigValues = {
  [cliendId: string]: ConfigValuesMap;
};
export type ClientConfigTranslations = {
  // ConfigTranslationMap is a lookup object which defines the UI control for a single config
  // ConfigTranslationMap = Record<ConfigKey, ConfigTranslation>;
  [cliendId: string]: ConfigTranslationMap;
};

export interface InitialClientConfigsProps {
  clientSpecs: NodeSpecification[];
  addNodeFlowSelection: ConfigTranslationAddNodeFlow;
  onChange?: (newClientConfigValues: ClientConfigValues) => void;
}

const InitialClientConfigs = ({
  clientSpecs,
  addNodeFlowSelection,
  onChange,
}: InitialClientConfigsProps) => {
  const [sClientConfigValues, dispatchClientConfigValues]: [
    ClientConfigValues,
    Dispatch<Object>,
  ] = useReducer(mergeObjectReducer, {});
  const [sClientConfigTranslations, setClientConfigTranslations] =
    useState<ClientConfigTranslations>({});
  const [
    sRequiredClientConfigTranslationByClient,
    setRequiredClientConfigTranslationByClient,
  ] = useState<Record<string, ConfigTranslationMap>>({});

  useEffect(() => {
    const clientConfigValues: ClientConfigValues = {};
    const clientConfigTranslations: ClientConfigTranslations = {};
    if (clientSpecs) {
      clientSpecs.forEach((clientSpec: NodeSpecification) => {
        // if the client is not new, keep the current config
        // todo: does this cause re-render?
        if (
          sClientConfigValues[clientSpec.specId] &&
          sClientConfigTranslations[clientSpec.specId]
        ) {
          clientConfigValues[clientSpec.specId] =
            sClientConfigValues[clientSpec.specId];
          clientConfigTranslations[clientSpec.specId] =
            sClientConfigTranslations[clientSpec.specId];
        } else {
          // if the user selectes a different client, initialize the state config translation and values
          clientConfigValues[clientSpec.specId] = {};
          clientConfigTranslations[clientSpec.specId] =
            clientSpec.configTranslation || {};
        }
      });
    }
    setClientConfigTranslations(clientConfigTranslations);
    dispatchClientConfigValues(clientConfigValues);

    // we only want to update these values when props.clientSpecs changes
    // adding the other deps would cause a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSpecs]);

  useEffect(() => {
    // When client config translations change, then it is first render or a newly selected node/client occurs.
    //  In both cases, we should set the default value for settings and notify the parents. DynamicSettings
    //  doesn't call onChange unless the user interacts with a settings control.
    const requiredClientConfigTranslationByClient: Record<
      string,
      ConfigTranslationMap
    > = {};
    const newClientConfigValues: ClientConfigValues = {};

    Object.keys(sClientConfigTranslations)?.forEach((clientId: string) => {
      const singleClientConfigTranslation = sClientConfigTranslations[clientId];

      const defaultValuesForConfigTranslations: ConfigValuesMap = {};
      const requiredClientConfigTranslation: ConfigTranslationMap = {};
      // Filter out only node config that is required for the add node flow
      Object.keys(singleClientConfigTranslation)?.forEach((configKey) => {
        const configTranslation = singleClientConfigTranslation[configKey];
        if (configTranslation.addNodeFlow === addNodeFlowSelection) {
          // Put in list of config to show the user
          requiredClientConfigTranslation[configKey] = configTranslation;
          // Get the default value and set it
          if (configTranslation.defaultValue !== undefined) {
            // todo: handle array of strings
            defaultValuesForConfigTranslations[configKey] =
              configTranslation.defaultValue as string;
          }
        }
      });
      requiredClientConfigTranslationByClient[clientId] =
        requiredClientConfigTranslation;

      // once we have the required configs, if undefined, set them to the default value
      // const currentClientConfigValues = sClientConfigValues[clientId];
      newClientConfigValues[clientId] = {
        ...defaultValuesForConfigTranslations,
        // ...currentClientConfigValues,
      };
    });

    dispatchClientConfigValues(newClientConfigValues);
    setRequiredClientConfigTranslationByClient(
      requiredClientConfigTranslationByClient,
    );
  }, [sClientConfigTranslations, addNodeFlowSelection]);

  useEffect(() => {
    console.log('useEffect sClientConfigValues: ', sClientConfigValues);
    if (onChange) {
      onChange(sClientConfigValues);
    }
    // todo: try useCallback in parent component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sClientConfigValues]);

  if (!clientSpecs) {
    return <>No clients found</>;
  }

  return (
    <div className={initialClientConfigContainer}>
      {Object.keys(sClientConfigTranslations)?.map((clientId: string) => {
        const requiredClientConfigTranslation =
          sRequiredClientConfigTranslationByClient[clientId];
        const singleClientConfigValues = sClientConfigValues[clientId];

        return (
          <React.Fragment key={clientId}>
            <DynamicSettings
              type="modal"
              categoryConfigs={[
                {
                  category: '',
                  configTranslationMap: requiredClientConfigTranslation,
                },
              ]}
              configValuesMap={singleClientConfigValues}
              isDisabled={false}
              onChange={(configKey: string, newValue: ConfigValue) => {
                dispatchClientConfigValues({
                  [clientId]: {
                    [configKey]: newValue as string,
                  },
                });
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default InitialClientConfigs;
