import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  NodeLibrary,
  NodePackageLibrary,
} from '../../../main/state/nodeLibrary';
import { ModalConfig } from '../ModalManager/modalUtils';
import {
  container,
  descriptionFont,
  sectionFont,
  titleFont,
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

export type ClientSelections = {
  [serviceId: string]: SelectOption;
};

export type AddNodeConfigurationValues = {
  clientSelections?: ClientSelections;
  storageLocation?: string;
};
export interface AddNodeConfigurationProps {
  nodeId?: NodeId;
  onChange?: (newValue: AddNodeConfigurationValues) => void;
  nodePackageConfig?: AddNodeConfigurationValues;
  modalOnChangeConfig?: (config: ModalConfig) => void;
}

const nodeSpecToSelectOption = (nodeSpec: NodeSpecification) => {
  return {
    iconId: nodeSpec.specId,
    value: nodeSpec.specId,
    label: nodeSpec.displayName,
    title: nodeSpec.displayName,
    info: nodeSpec.displayTagline ?? '',
    minority: nodeSpec.minorityClient ?? false,
  };
};

const AddNodeConfiguration = ({
  nodeId,
  nodePackageConfig,
  modalOnChangeConfig,
  onChange,
}: AddNodeConfigurationProps) => {
  const { t } = useTranslation();
  const { t: tGeneric } = useTranslation('genericComponents');
  const [sNodePackageSpec, setNodePackageSpec] =
    useState<NodePackageSpecification>();
  const [sNodePackageServices, setNodePackageServices] =
    useState<NodePackageNodeServiceSpec[]>();
  const [sClientSelections, setClientSelections] = useState<ClientSelections>(
    {},
  );
  const [sNodeStorageLocation, setNodeStorageLocation] = useState<string>(
    nodePackageConfig?.storageLocation || '',
  );
  const [sNodeLibrary, setNodeLibrary] = useState<NodeLibrary>();
  const [sNodePackageLibrary, setNodePackageLibrary] =
    useState<NodePackageLibrary>();

  const [
    sNodeStorageLocationFreeStorageGBs,
    setNodeStorageLocationFreeStorageGBs,
  ] = useState<number>();

  useEffect(() => {
    const fetchNodeLibrarys = async () => {
      const nodePackageLibrary: NodePackageLibrary =
        await electron.getNodePackageLibrary();
      setNodePackageLibrary(nodePackageLibrary);
      const nodeLibrary: NodeLibrary = await electron.getNodeLibrary();
      setNodeLibrary(nodeLibrary);
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
            typeof option === 'string' ? sNodeLibrary?.[option] : option;
          if (nodeSpec) {
            clientSelections[service.serviceId] =
              nodeSpecToSelectOption(nodeSpec);
          }
        },
      );
    }
    setNodePackageServices(clients);
    setClientSelections(clientSelections);
  }, [sNodePackageSpec, sNodeLibrary]);

  useEffect(() => {
    const fetchData = async () => {
      const defaultNodesStorageDetails =
        await electron.getNodesDefaultStorageLocation();
      const nodeLibrary: NodeLibrary = await electron.getNodeLibrary();
      const nodePackageLibrary: NodePackageLibrary =
        await electron.getNodePackageLibrary();
      console.log('defaultNodesStorageDetails', defaultNodesStorageDetails);
      setNodeStorageLocation(defaultNodesStorageDetails.folderPath);
      if (modalOnChangeConfig) {
        modalOnChangeConfig({
          selectedClients: sClientSelections,
          storageLocation: defaultNodesStorageDetails.folderPath,
          nodeLibrary,
          nodePackageLibrary,
        });
      }
      setNodeStorageLocationFreeStorageGBs(
        defaultNodesStorageDetails.freeStorageGBs,
      );
    };
    fetchData();

    // Modal Parent needs updated with the default initial value
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
        storageLocation: sNodeStorageLocation,
      });
    }
    // todo: try useCallback in parent component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sClientSelections, sNodeStorageLocation]);

  if (!sNodePackageSpec) {
    console.error(sNodePackageLibrary, nodeId);
    return <>No selected Node found</>;
  }

  return (
    <div className={container}>
      {!modalOnChangeConfig && (
        <div className={titleFont}>
          {t('LaunchAVarNode', { nodeName: sNodePackageSpec.displayName })}
        </div>
      )}
      <div>
        <div className={descriptionFont}>
          <>
            {sNodePackageSpec?.addNodeDescription ??
              t('AddNodeConfigurationDescription')}
          </>
        </div>
        {sNodePackageSpec?.specId === 'ethereum' && (
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
            typeof option === 'string' ? sNodeLibrary?.[option] : option;
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
      <p className={sectionFont}>{tGeneric('DataLocation')}</p>
      <p
        className={captionText}
      >{`Changing location only supported on Mac & Linux and only locations under /Users/<current-user>/ or /Volumes/`}</p>
      <FolderInput
        placeholder={sNodeStorageLocation ?? tGeneric('loadingDotDotDot')}
        freeStorageSpaceGBs={sNodeStorageLocationFreeStorageGBs}
        onClickChange={async () => {
          const storageLocationDetails =
            await electron.openDialogForStorageLocation();
          console.log('storageLocationDetails', storageLocationDetails);
          if (storageLocationDetails) {
            setNodeStorageLocation(storageLocationDetails.folderPath);
            if (modalOnChangeConfig) {
              modalOnChangeConfig({
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
  );
};

export default AddNodeConfiguration;
