import React, { useEffect, useReducer, useState } from 'react';
import { NodeSpecification } from '../../../common/nodeSpec';
import DynamicSettings from '../../Generics/redesign/DynamicSettings/DynamicSettings';
import {
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
  onChange?: (newClientConfigValues: ClientConfigValues) => void;
}

const InitialClientConfigs = ({
  clientSpecs,
  onChange,
}: InitialClientConfigsProps) => {
  const [sClientConfigValues, dispatchClientConfigValues] = useReducer(
    mergeObjectReducer,
    {},
  );
  const [sClientConfigTranslations, setClientConfigTranslations] =
    useState<ClientConfigTranslations>({});

  useEffect(() => {
    const clientConfigValues: ClientConfigValues = {};
    const clientConfigTranslations: ClientConfigTranslations = {};

    clientSpecs.forEach((clientSpec: NodeSpecification) => {
      clientConfigValues[clientSpec.specId] = {};
      clientConfigTranslations[clientSpec.specId] =
        clientSpec.configTranslation || {};
    });

    setClientConfigTranslations(clientConfigTranslations);
    dispatchClientConfigValues(clientConfigValues);
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
    <div className={initialClientConfigContainer}>
      {Object.keys(sClientConfigTranslations).map((clientId: string) => {
        const clientConfigTranslation = sClientConfigTranslations[clientId];
        const singleClientConfigValues = sClientConfigValues[clientId];

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
