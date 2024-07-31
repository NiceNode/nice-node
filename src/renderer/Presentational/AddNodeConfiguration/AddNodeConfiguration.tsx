import React, { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { NodeId } from '../../../common/node';
import type {
  NodePackageNodeServiceSpec,
  NodePackageSpecification,
  NodeSpecification,
} from '../../../common/nodeSpec';
import type {
  NodeLibrary,
  NodePackageLibrary,
} from '../../../main/state/nodeLibrary';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import FolderInput from '../../Generics/redesign/Input/FolderInput';
import DropdownLink from '../../Generics/redesign/Link/DropdownLink';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import SpecialSelect, {
  type SelectOption,
} from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import electron from '../../electronGlobal';
import { captionText } from '../PodmanInstallation/podmanInstallation.css';
import InitialClientConfigs, {
  type ClientConfigValues,
} from './InitialClientConfigs';
import {
  advancedOptionsLink,
  container,
  dataLocationContainer,
  descriptionFont,
  horizontalContainer,
  sectionFont,
  settingsContainer,
  titleFont,
} from './addNodeConfiguration.css';
import { mergeObjectReducer } from './deepMerge';

export type ClientSelections = {
  [serviceId: string]: SelectOption;
};

export type AddNodeConfigurationValues = {
  clientSelections?: ClientSelections;
  clientConfigValues?: ClientConfigValues;
  storageLocation?: string;
  nodePackageConfigValues?: ClientConfigValues;
};
export interface AddNodeConfigurationProps {
  nodeId?: NodeId;
  nodeLibrary?: NodeLibrary;
  nodePackageLibrary?: NodePackageLibrary;
  onChange?: (newValue: AddNodeConfigurationValues) => void;
  nodeStorageLocation?: string;
  shouldHideTitle?: boolean;
  disableSaveButton?: (value: boolean) => void;
  setTemporaryClientConfigValues?: (value: any) => void;
  tempConfigValues?: ClientConfigValues;
}

const nodeSpecToSelectOption = (nodeSpec: NodeSpecification) => {
  return {
    iconId: nodeSpec.specId,
    value: nodeSpec.specId,
    label: nodeSpec.displayName,
    title: nodeSpec.displayName,
    iconUrl: nodeSpec.iconUrl,
    info: nodeSpec.displayTagline ?? '',
    minority: nodeSpec.minorityClient ?? false,
    releasePhase: nodeSpec.nodeReleasePhase,
  };
};

const AddNodeConfiguration = ({
  nodeId,
  nodeStorageLocation,
  nodeLibrary,
  nodePackageLibrary,
  shouldHideTitle,
  onChange,
  disableSaveButton,
  setTemporaryClientConfigValues,
  tempConfigValues,
}: AddNodeConfigurationProps) => {
  const { t } = useTranslation();
  const [sNodePackageSpec, setNodePackageSpec] =
    useState<NodePackageSpecification>();
  const [sNodePackageSpecArr, setNodePackageSpecArr] = useState<
    NodePackageSpecification[]
  >([]);
  const [sNodePackageServices, setNodePackageServices] =
    useState<NodePackageNodeServiceSpec[]>();
  const [sClientSelections, setClientSelections] = useState<ClientSelections>(
    {},
  );
  const [sNodeStorageLocation, setNodeStorageLocation] = useState<string>(
    nodeStorageLocation || '',
  );
  const [sClientNodeSpecifications, setClientNodeSpecifications] = useState<
    NodeSpecification[]
  >([]);
  const [sClientConfigValues, dispatchClientConfigValues] = useReducer(
    mergeObjectReducer,
    {},
  );
  const [sNodePackageConfigValues, dispatchNodePackageConfigValues] =
    useReducer(mergeObjectReducer, {});

  const onChangeClientConfigValues = (value: any) => {
    dispatchClientConfigValues(value);
    setTemporaryClientConfigValues({
      payload: value,
    });
  };

  const onChangeNodePackageConfigValues = (value: any) => {
    dispatchNodePackageConfigValues(value);
    setTemporaryClientConfigValues({
      payload: value,
    });
  };

  const [
    sNodeStorageLocationFreeStorageGBs,
    setNodeStorageLocationFreeStorageGBs,
  ] = useState<number>();
  const [sIsAdvancedOptionsOpen, setIsAdvancedOptionsOpen] =
    useState<boolean>();

  const [requiredNodePackageSpecs, setRequiredNodePackageSpecs] = useState<
    NodeSpecification[]
  >([]);
  const [advancedNodePackageSpecs, setAdvancedNodePackageSpecs] = useState<
    NodeSpecification[]
  >([]);
  const [requiredClientSpecs, setRequiredClientSpecs] = useState<
    NodeSpecification[]
  >([]);
  const [advancedClientSpecs, setAdvancedClientSpecs] = useState<
    NodeSpecification[]
  >([]);

  useEffect(() => {
    // For Node Package Specs
    const requiredNodePackageSpecs: NodeSpecification[] = [];
    const advancedNodePackageSpecs: NodeSpecification[] = [];
    sNodePackageSpecArr.forEach((spec) => {
      const requiredConfigTranslations: { [key: string]: any } = {};
      const advancedConfigTranslations: { [key: string]: any } = {};

      if (spec?.configTranslation) {
        Object.entries(spec?.configTranslation).forEach(([key, value]) => {
          if (value.addNodeFlow === 'required') {
            requiredConfigTranslations[key] = value;
          } else if (value.addNodeFlow === 'advanced') {
            advancedConfigTranslations[key] = value;
          }
        });
      }

      if (Object.keys(requiredConfigTranslations).length > 0) {
        requiredNodePackageSpecs.push({
          ...spec,
          configTranslation: requiredConfigTranslations,
        });
      }
      if (Object.keys(advancedConfigTranslations).length > 0) {
        advancedNodePackageSpecs.push({
          ...spec,
          configTranslation: advancedConfigTranslations,
        });
      }
    });

    const requiredClientSpecs: NodeSpecification[] = [];
    const advancedClientSpecs: NodeSpecification[] = [];
    sClientNodeSpecifications.forEach((spec) => {
      const requiredConfigTranslations: { [key: string]: any } = {};
      const advancedConfigTranslations: { [key: string]: any } = {};

      if (spec.configTranslation) {
        Object.entries(spec.configTranslation).forEach(([key, value]) => {
          if (value.addNodeFlow === 'required') {
            requiredConfigTranslations[key] = value;
          } else if (value.addNodeFlow === 'advanced') {
            advancedConfigTranslations[key] = value;
          }
        });
      }

      if (Object.keys(requiredConfigTranslations).length > 0) {
        requiredClientSpecs.push({
          ...spec,
          configTranslation: requiredConfigTranslations,
        });
      }
      if (Object.keys(advancedConfigTranslations).length > 0) {
        advancedClientSpecs.push({
          ...spec,
          configTranslation: advancedConfigTranslations,
        });
      }
    });
    // Function to check if all required fields have non-empty default values
    const checkRequiredFields = (specs: NodeSpecification[]) => {
      return specs.every((spec) =>
        Object.values(spec.configTranslation || {}).every(
          (translation) =>
            translation.addNodeFlow !== 'required' ||
            (
              (typeof translation.defaultValue === 'string'
                ? translation.defaultValue
                : '') || ''
            ).trim() !== '',
        ),
      );
    };

    setRequiredNodePackageSpecs(requiredNodePackageSpecs);
    setAdvancedNodePackageSpecs(advancedNodePackageSpecs);
    setRequiredClientSpecs(requiredClientSpecs);
    setAdvancedClientSpecs(advancedClientSpecs);

    if (disableSaveButton) {
      // Perform the check for both Node Package Specs and Client Node Specs
      const allNodePackageFieldsValid = checkRequiredFields(
        requiredNodePackageSpecs,
      );
      const allClientFieldsValid = checkRequiredFields(requiredClientSpecs);

      // Disable save button if any required field is empty
      disableSaveButton(!(allNodePackageFieldsValid && allClientFieldsValid));
    }
  }, [sNodePackageSpecArr, sClientNodeSpecifications, disableSaveButton]);

  useEffect(() => {
    if (nodePackageLibrary && nodeId && nodePackageLibrary[nodeId]) {
      setNodePackageSpec(nodePackageLibrary[nodeId]);
    }
  }, [nodePackageLibrary, nodeId]);

  useEffect(() => {
    // initialize sClientSelections when nodePackage changes, then create options arrays for each service and all of its options
    const clients: NodePackageNodeServiceSpec[] = [];
    const clientSelections: ClientSelections = {};
    if (sNodePackageSpec) {
      setNodePackageSpecArr([sNodePackageSpec]);
      sNodePackageSpec.execution.services.forEach(
        (service: NodePackageNodeServiceSpec) => {
          clients.push(service);

          const firstNodeOption = service.nodeOptions[0];
          const previousSelection =
            tempConfigValues.clientSelections?.[service.serviceId];

          const nodeSpec =
            typeof firstNodeOption === 'string'
              ? nodeLibrary?.[firstNodeOption]
              : firstNodeOption;

          if (
            previousSelection &&
            nodeSpec &&
            previousSelection.value !== nodeSpec.specId
          ) {
            clientSelections[service.serviceId] = previousSelection;
          } else if (nodeSpec) {
            clientSelections[service.serviceId] =
              nodeSpecToSelectOption(nodeSpec);
          }
        },
      );
    } else {
      setNodePackageSpecArr([]);
    }
    setNodePackageServices(clients);
    setClientSelections(clientSelections);
  }, [sNodePackageSpec, nodeLibrary]);

  useEffect(() => {
    const nodeSpecs: NodeSpecification[] = [];
    Object.keys(sClientSelections).forEach((serviceId) => {
      const selectOption = sClientSelections[serviceId];
      const nodeSpec = nodeLibrary?.[selectOption.value];
      if (nodeSpec) {
        nodeSpecs.push(nodeSpec);
      }
    });
    setClientNodeSpecifications(nodeSpecs);
  }, [sClientSelections, nodeLibrary]);

  useEffect(() => {
    const fetchData = async () => {
      const defaultNodesStorageDetails =
        await electron.getNodesDefaultStorageLocation();
      console.log('defaultNodesStorageDetails', defaultNodesStorageDetails);
      setNodeStorageLocation(
        tempConfigValues?.storageLocation ||
          defaultNodesStorageDetails.folderPath,
      );
      if (onChange) {
        onChange({
          clientSelections: sClientSelections,
          storageLocation: defaultNodesStorageDetails.folderPath,
        });
      }
      setNodeStorageLocationFreeStorageGBs(
        defaultNodesStorageDetails.freeStorageGBs,
      );
    };
    fetchData();

    // Parent needs updated with the default initial value
    if (setClientSelections) {
      setClientSelections(sClientSelections);
    }
  }, []);

  const onChangeServiceSelection = (
    serviceId: string,
    newSelection?: SelectOption,
  ) => {
    if (!newSelection) return;
    console.log('new selected client: ', newSelection);
    const updatedSelections = {
      ...sClientSelections,
      [serviceId]: newSelection,
    };
    setClientSelections(updatedSelections);
    setTemporaryClientConfigValues({
      payload: { clientSelections: updatedSelections },
    });
  };

  useEffect(() => {
    console.log('here: ', sClientSelections, sNodeStorageLocation, onChange);
    if (onChange) {
      onChange({
        clientSelections: sClientSelections,
        clientConfigValues: sClientConfigValues,
        storageLocation: sNodeStorageLocation,
        nodePackageConfigValues: sNodePackageConfigValues,
      });
    }
    // todo: try useCallback in parent component
  }, [
    sClientSelections,
    sNodeStorageLocation,
    sClientConfigValues,
    sNodePackageConfigValues,
  ]);

  if (!sNodePackageSpec) {
    console.error(nodePackageLibrary, nodeId);
    return <>No selected Node found</>;
  }

  const { displayName, addNodeDescription, specId } = sNodePackageSpec;

  return (
    <div className={container}>
      {shouldHideTitle !== true && (
        <div id="launchAVarNodeTitle" className={titleFont}>
          {t('LaunchAVarNode', { nodeName: displayName })}
        </div>
      )}
      <div>
        <div className={descriptionFont}>
          {addNodeDescription ?? t('AddNodeConfigurationDescription')}
        </div>
        {specId === 'ethereum' && (
          <ExternalLink
            text={t('LearnMoreClientDiversity')}
            url="https://ethereum.org/en/developers/docs/nodes-and-clients/client-diversity/"
          />
        )}
      </div>
      {sNodePackageServices?.map((service) => {
        const options: SelectOption[] = [];
        for (let i = 0; i < service.nodeOptions.length; i++) {
          const option = service.nodeOptions[i];
          const nodeSpec =
            typeof option === 'string' ? nodeLibrary?.[option] : option;
          if (nodeSpec) {
            options.push(nodeSpecToSelectOption(nodeSpec));
          }
        }

        return (
          <React.Fragment key={service.serviceId}>
            <p className={sectionFont}>{service.name}</p>
            <SpecialSelect
              selectedOption={sClientSelections[service.serviceId]}
              onChange={(newValue) =>
                onChangeServiceSelection(service.serviceId, newValue)
              }
              options={options}
            />
          </React.Fragment>
        );
      })}

      <HorizontalLine />
      <div className={settingsContainer}>
        <div className={dataLocationContainer}>
          <p className={sectionFont}>{t('DataLocation')}</p>
          <p className={captionText}>{t('ChangingLocation')}</p>
          <FolderInput
            placeholder={sNodeStorageLocation ?? t('loadingDotDotDot')}
            freeStorageSpaceGBs={sNodeStorageLocationFreeStorageGBs}
            onClickChange={async () => {
              const storageLocationDetails =
                await electron.openDialogForStorageLocation();
              console.log('storageLocationDetails', storageLocationDetails);
              if (storageLocationDetails) {
                setNodeStorageLocation(storageLocationDetails.folderPath);
                if (onChange) {
                  onChange({
                    storageLocation: storageLocationDetails.folderPath,
                  });
                }
                setTemporaryClientConfigValues({
                  payload: {
                    storageLocation: storageLocationDetails.folderPath,
                  },
                });
                setNodeStorageLocationFreeStorageGBs(
                  storageLocationDetails.freeStorageGBs,
                );
              } else {
                // user didn't change the folder path
              }
            }}
          />
        </div>

        <div className={horizontalContainer}>
          <HorizontalLine />
        </div>

        {/* Initial node package settings, required */}
        {requiredNodePackageSpecs.length > 0 && (
          <InitialClientConfigs
            tempConfigValues={tempConfigValues}
            clientSpecs={requiredNodePackageSpecs}
            required
            disableSaveButton={disableSaveButton}
            onChange={onChangeNodePackageConfigValues}
          />
        )}
        {/* Initial client settings, required */}
        {requiredClientSpecs.length > 0 && (
          <InitialClientConfigs
            tempConfigValues={tempConfigValues}
            clientSpecs={requiredClientSpecs}
            required
            disableSaveButton={disableSaveButton}
            onChange={onChangeClientConfigValues}
          />
        )}
        {sIsAdvancedOptionsOpen && (
          <>
            {/* Initial node package settings, advanced */}
            {advancedNodePackageSpecs.length > 0 && (
              <InitialClientConfigs
                tempConfigValues={tempConfigValues}
                clientSpecs={advancedNodePackageSpecs}
                onChange={onChangeNodePackageConfigValues}
              />
            )}

            {/* Initial client settings, advanced */}
            {advancedClientSpecs.length > 0 && (
              <InitialClientConfigs
                tempConfigValues={tempConfigValues}
                clientSpecs={advancedClientSpecs}
                onChange={onChangeClientConfigValues}
              />
            )}
          </>
        )}
        {/* Initial client settings, required and optional */}
        {(advancedNodePackageSpecs.length > 0 ||
          advancedClientSpecs.length > 0) && (
          <div className={advancedOptionsLink}>
            <DropdownLink
              text={`${
                sIsAdvancedOptionsOpen
                  ? t('HideAdvancedOptions')
                  : t('ShowAdvancedOptions')
              }`}
              onClick={() => setIsAdvancedOptionsOpen(!sIsAdvancedOptionsOpen)}
              isDown={!sIsAdvancedOptionsOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNodeConfiguration;
