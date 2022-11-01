// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';

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

export interface AddNodeStepperProps {
  onChange: (newValue: 'done' | 'cancel') => void;
}

const TOTAL_STEPS = 3;

const AddNodeStepper = ({ onChange }: AddNodeStepperProps) => {
  const dispatch = useAppDispatch();
  const [sStep, setStep] = useState<number>(0);
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
    const ecNode = await electron.addNode(ecNodeSpec, sNodeStorageLocation);
    console.log('addNode returned node: ', ecNode);
    const ccNode = await electron.addNode(ccNodeSpec, sNodeStorageLocation);
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
        // if DockerInstallDone, add nodes, close modal (loading?)
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

  return (
    <div className={container}>
      <div className={componentContainer}>
        {/* Step 0 */}
        <div style={{ display: sStep === 0 ? '' : 'none' }}>
          <AddEthereumNode
            onChange={onChangeAddEthereumNode}
            // beaconOptions={sBeaconNodeLibrary}
            // executionOptions={sExecutionClientLibrary}
          />
        </div>

        {/* Step 1 */}
        <div style={{ display: sStep === 1 ? '' : 'none' }}>
          <NodeRequirements
            nodeRequirements={sEthereumNodeRequirements}
            systemData={sSystemData}
            nodeStorageLocation={sNodeStorageLocation}
          />
        </div>

        {/* Step 2 - If Docker is not installed */}
        <div style={{ display: sStep === 2 ? '' : 'none' }}>
          <DockerInstallation onChange={onChangeDockerInstall} />
        </div>
      </div>

      <div>
        <Stepper onChange={onStep} />
      </div>
    </div>
  );
};

export default AddNodeStepper;
