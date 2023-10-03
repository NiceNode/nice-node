import React, { useEffect, useState } from 'react';
import { NodeSpecification } from '../../../common/nodeSpec';
import DynamicSettings from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import {
  ConfigTranslationAddNodeFlow,
  ConfigTranslationMap,
  ConfigValue,
  ConfigValuesMap,
} from '../../../common/nodeConfig';

// The core data structure for this component
export type ClientConfigValues = {
  [cliendId: string]: ConfigValuesMap;
};
export type ClientConfigTranslations = {
  // ConfigTranslationMap is a lookup object which defines the UI control for a single config
  // Record<ConfigKey, ConfigTranslation>;
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
  const [sClientConfigValues, setClientConfigValues] =
    useState<ClientConfigValues>({});
  const [sClientConfigTranslations, setClientConfigTranslations] =
    useState<ClientConfigTranslations>({});

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
    setClientConfigValues(clientConfigValues);

    // we only want to update these values when props.clientSpecs changes
    // adding the other deps would cause a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSpecs]);

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
    <>
      {/* Initial client settings, required and optional */}

      {Object.keys(sClientConfigTranslations)?.map((clientId: string) => {
        const singleClientConfigTranslation =
          sClientConfigTranslations[clientId];
        const requiredClientConfigTranslation: ConfigTranslationMap = {};

        // Filter out only node config that is required for the add node flow
        Object.keys(singleClientConfigTranslation)?.map((configKey) => {
          const configTranslation = singleClientConfigTranslation[configKey];
          if (configTranslation.addNodeFlow === addNodeFlowSelection) {
            requiredClientConfigTranslation[configKey] = configTranslation;
          }
        });
        const singleClientConfigValues = sClientConfigValues[clientId];

        // If requiredClientConfigTranslation is empty, return null for this iteration.
        if (Object.keys(requiredClientConfigTranslation).length === 0) {
          return null;
        }

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
                setClientConfigValues({
                  ...sClientConfigValues,
                  [clientId]: {
                    ...sClientConfigValues[clientId],
                    [configKey]: newValue as string,
                  },
                });
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default InitialClientConfigs;
