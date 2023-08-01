// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';

import ContentWithSideArt from '../../Generics/redesign/ContentWithSideArt/ContentWithSideArt';
import { componentContainer, container } from './addNodeStepper.css';
import Stepper from '../../Generics/redesign/Stepper/Stepper';
import AddEthereumNode, {
  AddEthereumNodeValues,
} from '../AddEthereumNode/AddEthereumNode';
import PodmanInstallation from '../PodmanInstallation/PodmanInstallation';
import NodeRequirements from '../NodeRequirements/NodeRequirements';
import electron from '../../electronGlobal';
// import { NodeSpecification } from '../../../common/nodeSpec';
// import { categorizeNodeLibrary } from '../../utils';
import { SystemRequirements } from '../../../common/systemRequirements';
import { SystemData } from '../../../main/systemInfo';
import { mergeSystemRequirements } from './mergeNodeRequirements';
import { updateSelectedNodeId } from '../../state/node';
import { useAppDispatch } from '../../state/hooks';
import { NodeLibrary } from '../../../main/state/nodeLibrary';
import { reportEvent } from '../../events/reportEvent';
// import { CheckStorageDetails } from '../../../main/files';

import step1 from '../../assets/images/artwork/NN-Onboarding-Artwork-01.png';
import step2 from '../../assets/images/artwork/NN-Onboarding-Artwork-02.png';
import step3 from '../../assets/images/artwork/NN-Onboarding-Artwork-03.png';

export interface AddNodeStepperProps {
  modal?: boolean;
  onChange: (newValue: 'done' | 'cancel') => void;
}

const TOTAL_STEPS = 3;

const AddNodeStepper = ({ onChange, modal = false }: AddNodeStepperProps) => {
  const dispatch = useAppDispatch();
  const [sStep, setStep] = useState<number>(0);
  const [sDisabledSaveButton, setDisabledSaveButton] = useState<boolean>(true);
  // const [sExecutionClientLibrary, setExecutionClientLibrary] = useState<
  //   NodeSpecification[]
  // >([]);
  // const [sBeaconNodeLibrary, setBeaconNodeLibrary] = useState<
  //   NodeSpecification[]
  // >([]);
  const [sNodeLibrary, setNodeLibrary] = useState<NodeLibrary>();
  // <string, NodeSpecification>{}

  const [sEthereumNodeConfig, setEthereumNodeConfig] =
    useState<AddEthereumNodeValues>();
  const [sEthereumNodeRequirements, setEthereumNodeRequirements] =
    useState<SystemRequirements>();
  const [sNodeStorageLocation, setNodeStorageLocation] = useState<string>();

  const [sSystemData, setSystemData] = useState<SystemData>();

  const getData = async () => {
    setSystemData(await electron.getSystemInfo());
  };

  useEffect(() => {
    // on load, refresh the static data
    getData();
  }, []);

  // Load ALL node spec's when AddNodeStepper is created
  //  This can later be optimized to only retrieve NodeSpecs as needed
  useEffect(() => {
    const fetchNodeLibrary = async () => {
      const nodeLibrary: NodeLibrary = await electron.getNodeLibrary();
      console.log('nodeLibrary', nodeLibrary);
      // const categorized = categorizeNodeLibrary(nodeLibrary);
      // console.log('nodeLibrary categorized', categorized);
      setNodeLibrary(nodeLibrary);
      // setExecutionClientLibrary(categorized.ExecutionClient);
      // setBeaconNodeLibrary(categorized.BeaconNode);
      // // setLayer2ClientLibrary(categorized.L2);
      // setOtherNodeLibrary(categorized.Other);
      // set exec, beacons, and layer 2s
    };
    fetchNodeLibrary();
  }, []);

  const onChangePodmanInstall = useCallback((newValue: string) => {
    console.log('onChangePodmanInstall newValue ', newValue);
    setDisabledSaveButton(false);
    if (newValue === 'done') {
      setDisabledSaveButton(false);
    }
  }, []);

  const onChangeAddEthereumNode = useCallback(
    (newValue: AddEthereumNodeValues) => {
      console.log('onChangeAddEthereumNode newValue ', newValue);
      setEthereumNodeConfig(newValue);
      let ecReqs;
      let ccReqs;

      if (newValue?.executionClient) {
        const ecValue = newValue?.executionClient.value;
        if (sNodeLibrary) {
          ecReqs = sNodeLibrary?.[ecValue]?.systemRequirements;
        }
      }
      if (newValue?.consensusClient) {
        const ccValue = newValue?.consensusClient.value;
        if (sNodeLibrary) {
          ccReqs = sNodeLibrary?.[`${ccValue}-beacon`]?.systemRequirements;
        }
      }
      try {
        if (ecReqs && ccReqs) {
          const mergedReqs = mergeSystemRequirements([ecReqs, ccReqs]);
          setEthereumNodeRequirements(mergedReqs);
        } else {
          throw new Error('ec or ec node requirements undefined');
        }
      } catch (e) {
        console.error(e);
      }

      // save storage location (and other settings)
      setNodeStorageLocation(newValue.storageLocation);
    },
    [sNodeLibrary],
  );

  // useState when eth node changes, get node spec from value,
  //   and call func below
  // func: takes a NodeSpec & NodeSettings and returns NodeRequirements

  // "mergeNodeSpecs?"

  const addNodes = async () => {
    let ecNodeSpec;
    let ccNodeSpec;
    if (sEthereumNodeConfig?.executionClient) {
      const ecValue = sEthereumNodeConfig?.executionClient;
      if (sNodeLibrary) {
        ecNodeSpec = sNodeLibrary?.[ecValue.value];
      }
    }
    if (sEthereumNodeConfig?.consensusClient) {
      const ccValue = sEthereumNodeConfig?.consensusClient;
      if (sNodeLibrary) {
        ccNodeSpec = sNodeLibrary?.[`${ccValue.value}-beacon`];
      }
    }
    console.log(
      'adding nodes with storage location set to: ',
      sNodeStorageLocation,
    );
    if (!ecNodeSpec || !ccNodeSpec) {
      throw new Error('ecNodeSpec or ccNodeSpec is undefined');
    }

    const { ecNode, ccNode } = await electron.addEthereumNode(
      ecNodeSpec,
      ccNodeSpec,
      { storageLocation: sNodeStorageLocation },
    );
    reportEvent('AddNode');

    // const ecNode = await electron.addNode(ecNodeSpec, sNodeStorageLocation);
    console.log('addNode returned node: ', ecNode);
    // const ccNode = await electron.addNode(ccNodeSpec, sNodeStorageLocation);
    console.log('addNode returned node: ', ccNode);
    dispatch(updateSelectedNodeId(ecNode.id));
    const startEcResult = await electron.startNode(ecNode.id);
    console.log('startEcResult result: ', startEcResult);
    const startCcResult = await electron.startNode(ccNode.id);
    console.log('startCcResult result: ', startCcResult);

    // close?
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

  const getStepScreen = (step: number) => {
    let stepScreen = null;
    let stepImage = step1;
    switch (step) {
      case 0:
        stepScreen = (
          <AddEthereumNode
            onChange={onChangeAddEthereumNode}
            // beaconOptions={sBeaconNodeLibrary}
            // executionOptions={sExecutionClientLibrary}
          />
        );
        stepImage = step1;
        break;
      case 1:
        stepScreen = (
          <NodeRequirements
            nodeRequirements={sEthereumNodeRequirements}
            systemData={sSystemData}
            nodeStorageLocation={sNodeStorageLocation}
          />
        );
        stepImage = step2;
        break;
      case 2:
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
        {/* Step 0 */}
        <div style={{ display: sStep === 0 ? '' : 'none', height: '100%' }}>
          {getStepScreen(0)}
        </div>

        {/* Step 1 */}
        <div style={{ display: sStep === 1 ? '' : 'none', height: '100%' }}>
          {getStepScreen(1)}
        </div>

        {/* Step 2 - If Podman is not installed */}
        <div style={{ display: sStep === 2 ? '' : 'none', height: '100%' }}>
          {getStepScreen(2)}
        </div>
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
