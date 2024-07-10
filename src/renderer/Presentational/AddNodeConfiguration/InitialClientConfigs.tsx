import React, { useEffect, useReducer, useState } from 'react';
import type {
  ConfigTranslationMap,
  ConfigValue,
  ConfigValuesMap,
} from '../../../common/nodeConfig';
import type { NodeSpecification } from '../../../common/nodeSpec';
import DynamicSettings from '../../Generics/redesign/DynamicSettings/DynamicSettings';
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
  tempConfigValues: ConfigValuesMap;
  clientSpecs: NodeSpecification[];
  required?: boolean;
  disableSaveButton?: (value: boolean) => void;
  onChange?: (newClientConfigValues: ClientConfigValues) => void;
}

const InitialClientConfigs = ({
  tempConfigValues,
  clientSpecs,
  required = false,
  disableSaveButton = () => {},
  onChange,
}: InitialClientConfigsProps) => {
  const [sClientConfigValues, dispatchClientConfigValues] = useReducer(
    mergeObjectReducer,
    {} as ConfigValuesMap,
  );
  const [sClientConfigTranslations, setClientConfigTranslations] =
    useState<ClientConfigTranslations>({});
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    if (required) {
      // Initialize input values based on defaultValues
      const initialValues: Record<string, string> = {};
      clientSpecs.forEach((spec) => {
        if (spec.configTranslation) {
          Object.entries(spec.configTranslation).forEach(([key, value]) => {
            if (value.addNodeFlow === 'required') {
              initialValues[key] = value.defaultValue?.toString() || '';
            }
          });
        }
      });
      setInputValues(initialValues);
    }
  }, [clientSpecs, required]);

  const validateInputs = (currentValues: Record<string, string>) => {
    return Object.values(currentValues).every((value) => value.trim() !== '');
  };

  useEffect(() => {
    if (required) {
      const allRequiredFieldsHaveValues = clientSpecs.every((spec) => {
        return (
          spec.configTranslation &&
          Object.values(spec.configTranslation).every((translation) => {
            return (
              translation.addNodeFlow !== 'required' ||
              (translation.defaultValue !== undefined &&
                (typeof translation.defaultValue !== 'string'
                  ? translation.defaultValue[0]?.trim() !== ''
                  : translation.defaultValue.trim() !== ''))
            );
          })
        );
      });
      disableSaveButton(!allRequiredFieldsHaveValues);
    }
  }, [clientSpecs, required, disableSaveButton]);

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
  }, [sClientConfigValues]);

  if (!clientSpecs) {
    return <>No clients found</>;
  }

  const handleInputChange = (
    configKey: string,
    newValue: ConfigValue,
    clientId: string,
  ) => {
    dispatchClientConfigValues({
      [clientId]: {
        [configKey]: newValue as string,
      },
    });

    // Apply validation logic only for required specs
    if (required) {
      // Calculate the new state first
      const updatedValues = { ...inputValues, [configKey]: newValue };

      // Set the new state
      setInputValues(updatedValues);

      // Use the newly calculated state for validation
      const allInputsValid = validateInputs(updatedValues);
      disableSaveButton(!allInputsValid);
    }
  };

  return (
    <div className={initialClientConfigContainer}>
      {Object.keys(sClientConfigTranslations).map((clientId: string) => {
        const clientConfigTranslation = sClientConfigTranslations[clientId];
        const singleClientConfigValues =
          tempConfigValues[clientId] ||
          (sClientConfigValues as ConfigValuesMap)[clientId] ||
          {};

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
              required={required}
              onChange={(configKey: string, newValue: ConfigValue) => {
                handleInputChange(configKey, newValue, clientId);
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default InitialClientConfigs;
