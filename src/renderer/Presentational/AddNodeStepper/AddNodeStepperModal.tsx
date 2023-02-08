// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';

import { setModalConfig, setModalState } from 'renderer/state/modal';
import ContentWithSideArt from '../../Generics/redesign/ContentWithSideArt/ContentWithSideArt';
import { componentContainer, container } from './addNodeStepper.css';
import Stepper from '../../Generics/redesign/Stepper/Stepper';
import AddEthereumNode, {
  AddEthereumNodeValues,
} from '../AddEthereumNode/AddEthereumNode';
import DockerInstallation from '../DockerInstallation/DockerInstallation';
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
// import { CheckStorageDetails } from '../../../main/files';

import step1 from '../../assets/images/artwork/NN-Onboarding-Artwork-01.png';
import step2 from '../../assets/images/artwork/NN-Onboarding-Artwork-02.png';
import step3 from '../../assets/images/artwork/NN-Onboarding-Artwork-03.png';

export interface AddNodeStepperModalProps {
  modal?: boolean;
  modalOnChangeConfig: (config: object) => void;
}

const TOTAL_STEPS = 2;

const AddNodeStepperModal = ({
  modal = false,
  modalOnChangeConfig,
}: AddNodeStepperModalProps) => {
  const dispatch = useAppDispatch();
  const [sStep, setStep] = useState<number>(0);
  const [sNodeLibrary, setNodeLibrary] = useState<NodeLibrary>();
  const [sEthereumNodeConfig, setEthereumNodeConfig] =
    useState<AddEthereumNodeValues>();
  const [sEthereumNodeRequirements, setEthereumNodeRequirements] =
    useState<SystemRequirements>();
  const [sNodeStorageLocation, setNodeStorageLocation] = useState<string>();

  const [sSystemData, setSystemData] = useState<SystemData>();

  const resetModal = () => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
        config: {},
      })
    );
  };

  const getData = async () => {
    setSystemData(await electron.getSystemInfo());
  };

  useEffect(() => {
    // on load, refresh the static data
    getData();
  }, []);

  // Load ALL node spec's when AddNodeStepperModal is created
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

  const onChangeDockerInstall = useCallback((newValue: string) => {
    console.log('onChangeDockerInstall newValue ', newValue);
  }, []);

  const onChangeAddEthereumNode = useCallback(
    (newValue: AddEthereumNodeValues) => {
      console.log('onChangeAddEthereumNode newValue ', newValue);
      setEthereumNodeConfig(newValue);
      let ecReqs;
      let ccReqs;

      if (newValue?.executionClient) {
        const ecValue = newValue?.executionClient;
        if (sNodeLibrary) {
          ecReqs = sNodeLibrary?.[ecValue]?.systemRequirements;
        }
      }
      if (newValue?.consensusClient) {
        const ccValue = newValue?.consensusClient;
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
    [sNodeLibrary]
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
        ecNodeSpec = sNodeLibrary?.[ecValue];
      }
    }
    if (sEthereumNodeConfig?.consensusClient) {
      const ccValue = sEthereumNodeConfig?.consensusClient;
      if (sNodeLibrary) {
        ccNodeSpec = sNodeLibrary?.[`${ccValue}-beacon`];
      }
    }
    console.log(
      'adding nodes with storage location set to: ',
      sNodeStorageLocation
    );
    if (!ecNodeSpec || !ccNodeSpec) {
      throw new Error('ecNodeSpec or ccNodeSpec is undefined');
      return;
    }

    modalOnChangeConfig({
      ecNodeSpec,
      ccNodeSpec,
      storageLocation: sNodeStorageLocation,
    });

    const { ecNode, ccNode } = await electron.addEthereumNode(
      ecNodeSpec,
      ccNodeSpec,
      { storageLocation: sNodeStorageLocation }
    );
    // const ecNode = await electron.addNode(ecNodeSpec, sNodeStorageLocation);
    console.log('addNode returned node: ', ecNode);
    // const ccNode = await electron.addNode(ccNodeSpec, sNodeStorageLocation);
    console.log('addNode returned node: ', ccNode);
    dispatch(updateSelectedNodeId(ecNode.id));
    const startEcResult = await electron.startNode(ecNode.id);
    console.log('startEcResult result: ', startEcResult);
    const startCcResult = await electron.startNode(ccNode.id);
    console.log('startCcResult result: ', startCcResult);

    // close modal
    resetModal();
    setStep(0);
  };

  const getStepScreen = () => {
    let stepScreen = null;
    let stepImage = step1;
    switch (sStep) {
      case 0:
        stepScreen = <AddEthereumNode onChange={onChangeAddEthereumNode} />;
        stepImage = step1;
        break;
      case 1:
        stepScreen = <DockerInstallation onChange={onChangeDockerInstall} />;
        stepImage = step3;
        break;
      default:
    }

    return (
      <div style={{ height: '100%' }}>
        <ContentWithSideArt modal={modal} graphic={stepImage}>
          {stepScreen}
        </ContentWithSideArt>
      </div>
    );
  };

  return (
    <div className={container}>
      <div className={componentContainer}>{getStepScreen()}</div>
    </div>
  );
};

export default AddNodeStepperModal;
