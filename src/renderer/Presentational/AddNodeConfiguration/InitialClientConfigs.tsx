import React, { useEffect, useState } from 'react';
import { NodeSpecification } from '../../../common/nodeSpec';
import DynamicSettings from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import {
  ConfigTranslationAddNodeFlow,
  ConfigTranslationMap,
  ConfigValue,
  ConfigValuesMap,
} from '../../../common/nodeConfig';
import { initialClientConfigContainer } from './addNodeConfiguration.css';

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
  configTranslations: ClientConfigTranslations;
  onChange?: (newClientConfigValues: ClientConfigValues) => void;
}

const InitialClientConfigs = ({
  clientSpecs,
  configTranslations,
  onChange,
}: InitialClientConfigsProps) => {
  const [sClientConfigValues, setClientConfigValues] =
    useState<ClientConfigValues>({});

  useEffect(() => {
    const clientConfigValues: ClientConfigValues = {};

    clientSpecs.forEach((clientSpec: NodeSpecification) => {
      // if the client configuration exists, keep the current config
      if (sClientConfigValues[clientSpec.specId]) {
        clientConfigValues[clientSpec.specId] =
          sClientConfigValues[clientSpec.specId];
      } else {
        // if the user selects a different client, initialize the state values
        clientConfigValues[clientSpec.specId] = {};
      }
    });

    setClientConfigValues(clientConfigValues);

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
      <div className={initialClientConfigContainer}>
        {/* Initial client settings, required and optional */}

        {Object.keys(configTranslations).map((clientId: string) => {
          const clientConfigTranslation = configTranslations[clientId];

          return (
            <React.Fragment key={clientId}>
              <DynamicSettings
                type="modal"
                categoryConfigs={[
                  {
                    category: '',
                    configTranslationMap: clientConfigTranslation,
                  },
                ]}
                configValuesMap={sClientConfigValues[clientId]}
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
      </div>
    </>
  );
};

export default InitialClientConfigs;
