// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';

import type { SystemRequirements } from '../../../common/systemRequirements';
import type {
  NodeLibrary,
  NodePackageLibrary,
} from '../../../main/state/nodeLibrary';
import ContentWithSideArt from '../../Generics/redesign/ContentWithSideArt/ContentWithSideArt';
import Stepper from '../../Generics/redesign/Stepper/Stepper';
import electron from '../../electronGlobal';
import { reportEvent } from '../../events/reportEvent';
import { useAppDispatch } from '../../state/hooks';
import { updateSelectedNodePackageId } from '../../state/node';
import AddNode, { type AddNodeValues } from '../AddNode/AddNode';
import NodeRequirements from '../NodeRequirements/NodeRequirements';
import PodmanInstallation from '../PodmanInstallation/PodmanInstallation';
import { componentContainer, container } from './addNodeStepper.css';
import { mergeSystemRequirements } from './mergeNodeRequirements';

import type { NodePackageSpecification } from '../../../common/nodeSpec';
import type { AddNodePackageNodeService } from '../../../main/nodePackageManager';
import step1 from '../../assets/images/artwork/NN-Onboarding-Artwork-01.png';
import step2 from '../../assets/images/artwork/NN-Onboarding-Artwork-02.png';
import step3 from '../../assets/images/artwork/NN-Onboarding-Artwork-03.png';
import AddNodeConfiguration, {
  type AddNodeConfigurationValues,
} from '../AddNodeConfiguration/AddNodeConfiguration';
import { mergePackageAndClientConfigValues } from '../AddNodeConfiguration/mergePackageAndClientConfigValues';

export interface AddNodeStepperProps {
  modal?: boolean;
  onChange: (newValue: 'done' | 'cancel') => void;
}

const TOTAL_STEPS = 4;

const AddNodeStepper = ({ onChange, modal = false }: AddNodeStepperProps) => {
  const dispatch = useAppDispatch();
  const [sStep, setStep] = useState<number>(0);
  const [sDisabledSaveButton, setDisabledSaveButton] = useState<boolean>(true);
  const [sNodeLibrary, setNodeLibrary] = useState<NodeLibrary>();
  const [sNodePackageLibrary, setNodePackageLibrary] =
    useState<NodePackageLibrary>();

  const [sNode, setNode] = useState<AddNodeValues>();

  const [sNodeClientsAndSettings, setNodeClientsAndSettings] =
    useState<AddNodeConfigurationValues>();
  const [sNodeRequirements, setEthereumNodeRequirements] =
    useState<SystemRequirements>();
  const [sNodeStorageLocation, setNodeStorageLocation] = useState<string>();

  // Load ALL node spec's when AddNodeStepper is created
  //  This can later be optimized to only retrieve NodeSpecs as needed
  useEffect(() => {
    const fetchNodeLibrarys = async () => {
      const nodeLibrary: NodeLibrary = await electron.getNodeLibrary();
      setNodeLibrary(nodeLibrary);
      const nodePackageLibrary: NodePackageLibrary =
        await electron.getNodePackageLibrary();
      setNodePackageLibrary(nodePackageLibrary);
    };
    fetchNodeLibrarys();
  }, []);

  const onChangePodmanInstall = useCallback((newValue: string) => {
    console.log('onChangePodmanInstall newValue ', newValue);
    setDisabledSaveButton(false);
    if (newValue === 'done') {
      setDisabledSaveButton(false);
    }
  }, []);

  const onChangeAddNode = useCallback(
    (newValue: AddNodeValues) => {
      console.log('onChangeAddNode newValue ', newValue);
      setNode(newValue);
      let nodeReqs;

      if (newValue?.node) {
        const ecValue = newValue?.node.value;
        if (sNodeLibrary) {
          nodeReqs = sNodeLibrary?.[ecValue]?.systemRequirements;
        }
      }
      try {
        if (nodeReqs) {
          setEthereumNodeRequirements(nodeReqs);
        } else {
          throw new Error(
            `Node requirements undefined for ${JSON.stringify(newValue)}`,
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    [sNodeLibrary],
  );

  const addNodes = async () => {
    // Mostly duplicate code with AddNodeModal.modalOnSaveConfig()
    let nodePackageSpec: NodePackageSpecification;
    if (sNodePackageLibrary && sNode?.node?.value) {
      nodePackageSpec = sNodePackageLibrary?.[sNode?.node?.value];
    } else {
      console.error(
        'nodePackageLibrary, node: ',
        sNodePackageLibrary,
        sNode?.node?.value,
      );
      throw new Error('No Node Package Spec found for the selected node');
    }
    if (!sNodeClientsAndSettings) {
      throw new Error(
        'No Node client selections or settings found for the selected node',
      );
    }

    // todo: set client initial values from packageInitialValues
    const services: AddNodePackageNodeService[] = [];
    const { clientSelections, clientConfigValues, nodePackageConfigValues } =
      sNodeClientsAndSettings;
    if (sNodeLibrary && clientSelections) {
      for (const [serviceId, selectOption] of Object.entries(
        clientSelections,
      )) {
        console.log(`${serviceId}: ${selectOption}`);
        const clientId = selectOption.value;
        const serviceNodeSpec =
          sNodeLibrary?.[clientId] ?? sNodeLibrary?.[`${clientId}-beacon`];
        if (!serviceNodeSpec) {
          console.error(
            'No service node spec found when finishing add node flow.',
            serviceId,
            clientId,
          );
          throw new Error(
            'No service node spec found when finishing add node flow.',
          );
        }
        const serviceDefinition = nodePackageSpec.execution.services.find(
          (service) => service.serviceId === serviceId,
        );
        const mergedPackageAndClientConfigValues =
          mergePackageAndClientConfigValues({
            nodePackageSpec,
            nodePackageConfigValues:
              nodePackageConfigValues?.[nodePackageSpec.specId],
            clientConfigValues: clientConfigValues?.[clientId],
            serviceId,
          });
        services.push({
          serviceId,
          serviceName: serviceDefinition?.name ?? serviceId,
          spec: serviceNodeSpec,
          initialConfigValues: mergedPackageAndClientConfigValues,
        });
      }
    }

    const { node: nodePackage } = await electron.addNodePackage(
      nodePackageSpec,
      services,
      {
        storageLocation: sNodeStorageLocation,
        configValues: nodePackageConfigValues?.[nodePackageSpec.specId],
      },
    );
    console.log('nodePackage result: ', nodePackage);
    const packageNetwork =
      (nodePackageConfigValues?.[nodePackageSpec.specId]?.network as string) ??
      '';
    reportEvent('AddNodePackage', {
      nodePackage: nodePackageSpec.specId,
      clients: services.map((service) => service.spec.specId),
      network: packageNetwork,
    });
    dispatch(updateSelectedNodePackageId(nodePackage.id));

    electron.startNodePackage(nodePackage.id);

    // close stepper
    onChange('done');
    setStep(0);
  };

  const onStep = (newValue: string) => {
    console.log('onStep: ', newValue);
    if (newValue === 'next') {
      // = sign because sStep index starts at 0
      if (sStep + 1 >= TOTAL_STEPS) {
        // done
        onChange('done');
        // if PodmanInstallDone, add nodes, close modal (loading?)
        addNodes();
      } else {
        setStep(sStep + 1);
      }
    } else if (newValue === 'previous') {
      if (sStep - 1 < 0) {
        // cancelled
        onChange('cancel');
      } else {
        setStep(sStep - 1);
      }
    }
  };

  const onChangeAddNodeConfiguration = useCallback(
    (newValue: AddNodeConfigurationValues) => {
      setNodeClientsAndSettings(newValue);
      const reqs: SystemRequirements[] = [];

      if (!sNodeLibrary) {
        // todo: handle
        console.error('No sNodeLibrary found.');
        return;
      }
      if (newValue?.clientSelections) {
        for (const [serviceId, selectOption] of Object.entries(
          newValue?.clientSelections,
        )) {
          console.log(`${serviceId}: ${selectOption}`);
          const clientId = selectOption.value;
          if (sNodeLibrary?.[clientId]?.systemRequirements) {
            reqs.push(
              sNodeLibrary[clientId].systemRequirements as SystemRequirements,
            );
          }
        }
      }
      try {
        const mergedReqs = mergeSystemRequirements(reqs);
        console.log('mergedReqs: ', mergedReqs);
        setEthereumNodeRequirements(mergedReqs);
      } catch (e) {
        console.error(e);
      }

      // save storage location (and other settings)
      setNodeStorageLocation(newValue.storageLocation);
    },
    [sNodeLibrary],
  );

  const getStepScreen = () => {
    let stepScreen = null;
    let stepImage = step1;
    switch (sStep) {
      case 0:
        stepScreen = <AddNode onChange={onChangeAddNode} />;
        stepImage = step1;
        break;
      case 1:
        stepScreen = (
          <AddNodeConfiguration
            nodeLibrary={sNodeLibrary}
            nodePackageLibrary={sNodePackageLibrary}
            nodeId={sNode?.node?.value}
            onChange={onChangeAddNodeConfiguration}
          />
        );
        stepImage = step1;
        break;
      case 2:
        stepScreen = (
          <NodeRequirements
            nodeRequirements={sNodeRequirements}
            nodeStorageLocation={sNodeStorageLocation}
          />
        );
        stepImage = step2;
        break;
      case 3:
        stepScreen = (
          <PodmanInstallation
            onChange={onChangePodmanInstall}
            disableSaveButton={setDisabledSaveButton}
          />
        );
        stepImage = step3;
        break;
      default:
    }

    return (
      <ContentWithSideArt modal={modal} graphic={stepImage}>
        {stepScreen}
      </ContentWithSideArt>
    );
  };

  return (
    <div className={container}>
      <div className={componentContainer}>
        <div style={{ height: '100%' }}>{getStepScreen()}</div>
      </div>
      <Stepper
        step={sStep}
        onChange={onStep}
        disabledSaveButton={sDisabledSaveButton}
      />
    </div>
  );
};

export default AddNodeStepper;
