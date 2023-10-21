import React, { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { mergeObjectReducer } from './deepMerge';
import {
  NodeLibrary,
  NodePackageLibrary,
} from '../../../main/state/nodeLibrary';
import {
  container,
  descriptionFont,
  sectionFont,
  titleFont,
  advancedOptionsLink,
  dataLocationContainer,
} from './addNodeConfiguration.css';
import SpecialSelect, {
  SelectOption,
} from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import electron from '../../electronGlobal';
import FolderInput from '../../Generics/redesign/Input/FolderInput';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import { captionText } from '../PodmanInstallation/podmanInstallation.css';
import {
  NodePackageSpecification,
  NodePackageNodeServiceSpec,
  NodeSpecification,
} from '../../../common/nodeSpec';
import { NodeId } from '../../../common/node';
import ExternalLink from '../../Generics/redesign/Link/ExternalLink';
import InitialClientConfigs, {
  ClientConfigValues,
} from './InitialClientConfigs';
import DropdownLink from '../../Generics/redesign/Link/DropdownLink';

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
  onChange?: (newValue: AddNodeConfigurationValues) => void;
  nodePackageConfig?: AddNodeConfigurationValues;
  shouldHideTitle?: boolean;
}

const nodeSpecToSelectOption = (nodeSpec: NodeSpecification) => {
  return {
    iconId: nodeSpec.specId,
    value: nodeSpec.specId,
    label: nodeSpec.displayName,
    title: nodeSpec.displayName,
    info: nodeSpec.displayTagline ?? '',
    minority: nodeSpec.minorityClient ?? false,
    releasePhase: nodeSpec.nodeReleasePhase,
  };
};

const AddNodeConfiguration = ({
  nodeId,
  nodePackageConfig,
  nodeLibrary,
  shouldHideTitle,
  onChange,
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
    nodePackageConfig?.storageLocation || '',
  );
  const [sNodePackageLibrary, setNodePackageLibrary] =
    useState<NodePackageLibrary>();
  const [sClientNodeSpecifications, setClientNodeSpecifications] = useState<
    NodeSpecification[]
  >([]);
  const [sClientConfigValues, dispatchClientConfigValues] = useReducer(
    mergeObjectReducer,
    {},
  );
  const [sNodePackageConfigValues, dispatchNodePackageConfigValues] =
    useReducer(mergeObjectReducer, {});

  const [
    sNodeStorageLocationFreeStorageGBs,
    setNodeStorageLocationFreeStorageGBs,
  ] = useState<number>();
  const [sIsAdvancedOptionsOpen, setIsAdvancedOptionsOpen] =
    useState<boolean>();

  useEffect(() => {
    if (sNodePackageSpec) {
      setNodePackageSpecArr([sNodePackageSpec]);
    } else {
      setNodePackageSpecArr([]);
    }
  }, [sNodePackageSpec]);

  useEffect(() => {
    const fetchNodeLibrarys = async () => {
      const nodePackageLibrary: NodePackageLibrary =
        await electron.getNodePackageLibrary();
      setNodePackageLibrary(nodePackageLibrary);
    };
    fetchNodeLibrarys();
  }, []);

  useEffect(() => {
    if (sNodePackageLibrary && nodeId && sNodePackageLibrary[nodeId]) {
      setNodePackageSpec(sNodePackageLibrary[nodeId]);
    }
  }, [sNodePackageLibrary, nodeId]);

  useEffect(() => {
    // initialize sClientSelections when nodePackage changes, then create options arrays for each service and all of its options
    const clients: NodePackageNodeServiceSpec[] = [];
    const clientSelections: ClientSelections = {};
    if (sNodePackageSpec) {
      sNodePackageSpec.execution.services.forEach(
        (service: NodePackageNodeServiceSpec) => {
          clients.push(service);

          // Set the pre-selected client as the first for each service
          const option = service.nodeOptions[0];
          const nodeSpec =
            typeof option === 'string' ? nodeLibrary?.[option] : option;
          if (nodeSpec) {
            clientSelections[service.serviceId] =
              nodeSpecToSelectOption(nodeSpec);
          }
        },
      );
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
      setNodeStorageLocation(defaultNodesStorageDetails.folderPath);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeServiceSelection = (
    serviceId: string,
    newSelection?: SelectOption,
  ) => {
    if (!newSelection) return;
    console.log('new selected client: ', newSelection);
    setClientSelections({ ...sClientSelections, [serviceId]: newSelection });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sClientSelections,
    sNodeStorageLocation,
    sClientConfigValues,
    sNodePackageConfigValues,
  ]);

  if (!sNodePackageSpec) {
    console.error(sNodePackageLibrary, nodeId);
    return <>No selected Node found</>;
  }

  const { displayName, addNodeDescription, specId } = sNodePackageSpec;

  return (
    <div className={container}>
      {shouldHideTitle !== true && (
        <div className={titleFont}>
          {t('LaunchAVarNode', { nodeName: displayName })}
        </div>
      )}
      <div>
        <div className={descriptionFont}>
          <>{addNodeDescription ?? t('AddNodeConfigurationDescription')}</>
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
              setNodeStorageLocationFreeStorageGBs(
                storageLocationDetails.freeStorageGBs,
              );
            } else {
              // user didn't change the folder path
            }
          }}
        />
      </div>

      <HorizontalLine />

      {/* Initial node package settings, required */}
      <InitialClientConfigs
        clientSpecs={sNodePackageSpecArr}
        addNodeFlowSelection="required"
        onChange={(newConfigValues) => {
          dispatchNodePackageConfigValues(newConfigValues);
        }}
      />
      {/* Initial client settings, required */}
      <InitialClientConfigs
        clientSpecs={sClientNodeSpecifications}
        addNodeFlowSelection="required"
        onChange={(newClientConfigValues) => {
          dispatchClientConfigValues(newClientConfigValues);
        }}
      />
      {/* Initial client settings, required and optional */}
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
      {sIsAdvancedOptionsOpen && (
        <>
          {/* Initial node package settings, advanced */}
          <InitialClientConfigs
            clientSpecs={sNodePackageSpecArr}
            addNodeFlowSelection="advanced"
            onChange={(newConfigValues) => {
              dispatchNodePackageConfigValues(newConfigValues);
            }}
          />
          {/* Initial client settings, advanced */}
          <InitialClientConfigs
            clientSpecs={sClientNodeSpecifications}
            addNodeFlowSelection="advanced"
            onChange={(newClientConfigValues) => {
              dispatchClientConfigValues(newClientConfigValues);
            }}
          />
        </>
      )}
    </div>
  );
};

export default AddNodeConfiguration;
