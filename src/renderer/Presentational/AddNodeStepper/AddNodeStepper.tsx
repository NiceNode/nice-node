// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { componentContainer, container } from './addNodeStepper.css';
import Stepper from '../../Generics/redesign/Stepper/Stepper';
import AddEthereumNode from '../AddEthereumNode/AddEthereumNode';
import DockerInstallation from '../DockerInstallation/DockerInstallation';
import NodeRequirements from '../NodeRequirements/NodeRequirements';
import electron from '../../electronGlobal';
import { NodeSpecification } from '../../../common/nodeSpec';
import { categorizeNodeLibrary } from '../../utils';
import { SystemRequirements } from '../../../common/systemRequirements';
import { SystemData } from '../../../main/systemInfo';

export interface AddNodeStepperProps {
  onChange: (newValue: 'done' | 'cancel') => void;
}

const TOTAL_STEPS = 3;

const AddNodeStepper = ({ onChange }: AddNodeStepperProps) => {
  const { t } = useTranslation();
  const [sStep, setStep] = useState<number>(0);
  const [sExecutionClientLibrary, setExecutionClientLibrary] = useState<
    NodeSpecification[]
  >([]);
  const [sBeaconNodeLibrary, setBeaconNodeLibrary] = useState<
    NodeSpecification[]
  >([]);
  const [sNodeLibrary, setNodeLibrary] = useState<any>();
  // <string, NodeSpecification>{}

  const [sEthereumNodeConfig, setEthereumNodeConfig] = useState<any>();
  const [sEthereumNodeRequirements, setEthereumNodeRequirements] =
    useState<SystemRequirements>();

  const [sData, setData] = useState<SystemData>();

  const getData = async () => {
    setData(await electron.getSystemInfo());
  };

  useEffect(() => {
    // on load, refresh the static data
    getData();
  }, []);

  // Load ALL node spec's when AddNodeStepper is created
  //  This can later be optimized to only retrieve NodeSpecs as needed
  useEffect(() => {
    const fetchNodeLibrary = async () => {
      const nodeLibrary = await electron.getNodeLibrary();
      console.log('nodeLibrary', nodeLibrary);
      const categorized = categorizeNodeLibrary(nodeLibrary);
      // console.log('nodeLibrary categorized', categorized);
      setNodeLibrary(nodeLibrary);
      setExecutionClientLibrary(categorized.ExecutionClient);
      setBeaconNodeLibrary(categorized.BeaconNode);
      // // setLayer2ClientLibrary(categorized.L2);
      // setOtherNodeLibrary(categorized.Other);
      // set exec, beacons, and layer 2s
    };
    fetchNodeLibrary();
  }, []);

  const onChangeDockerInstall = (newValue: string) => {
    console.log('onChangeDockerInstall newValue ', newValue);
  };

  const onChangeAddEthereumNode = useCallback(
    (newValue: any) => {
      console.log('onChangeAddEthereumNode newValue ', newValue);
      setEthereumNodeConfig(newValue);
      let reqs;

      if (newValue?.executionClient?.value) {
        const ecValue = newValue?.executionClient?.value;
        if (sNodeLibrary) {
          reqs = sNodeLibrary?.[ecValue]?.systemRequirements;
        }
      }
      setEthereumNodeRequirements(reqs);
    },
    [sNodeLibrary]
  );

  // useState when eth node changes, get node spec from value,
  //   and call func below
  // func: takes a NodeSpec & NodeSettings and returns NodeRequirements

  // "mergeNodeSpecs?"

  const onStep = (newValue: string) => {
    console.log('onStep: ', newValue);
    if (newValue === 'next') {
      // = sign because sStep index starts at 0
      if (sStep + 1 >= TOTAL_STEPS) {
        // done
        onChange('done');
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
            executionOptions={sExecutionClientLibrary}
            beaconOptions={sBeaconNodeLibrary}
          />
        </div>

        {/* Step 1 */}
        <div style={{ display: sStep === 1 ? '' : 'none' }}>
          <NodeRequirements
            nodeRequirements={sEthereumNodeRequirements}
            systemData={sData}
          />
        </div>

        {/* Step 2 */}
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
