// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';

import { setModalConfig, setModalState } from 'renderer/state/modal';
import { SelectOption } from 'renderer/Generics/redesign/SpecialSelect/SpecialSelect';
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
  modalOnSaveConfig: () => void;
}

const TOTAL_STEPS = 2;

const AddNodeStepperModal = ({
  modal = false,
  modalOnChangeConfig,
  modalOnSaveConfig,
}: AddNodeStepperModalProps) => {
  const dispatch = useAppDispatch();
  const [sStep, setStep] = useState<number>(0);
  const [sNodeLibrary, setNodeLibrary] = useState<NodeLibrary>();
  const [sEthereumNodeConfig, setEthereumNodeConfig] =
    useState<AddEthereumNodeValues>();
  const [sNodeStorageLocation, setNodeStorageLocation] = useState<string>();

  useEffect(() => {
    console.log('initialize add node stepper modal');
  }, []);

  const setConsensusClient = (
    clClient: SelectOption,
    ethereumNodeConfig: AddEthereumNodeValues
  ) => {
    const config = { ...ethereumNodeConfig, consensusClient: clClient };
    modalOnChangeConfig({ consensusClient: clClient.value });
    setEthereumNodeConfig(config);
  };

  const setExecutionClient = (
    elClient: SelectOption,
    ethereumNodeConfig: AddEthereumNodeValues
  ) => {
    console.log('set execution client');
    const config = { ...ethereumNodeConfig, executionClient: elClient };
    modalOnChangeConfig({ executionClient: elClient.value });
    setEthereumNodeConfig(config);
  };

  const setStorageLocation = (storageLocation: string) => {
    modalOnChangeConfig({ storageLocation });
    setNodeStorageLocation(storageLocation);
  };

  const resetModal = () => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
        config: {},
      })
    );
  };

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

  // const onChangeAddEthereumNode = (newValue: AddEthereumNodeValues) => {
  //   console.log('onChangeAddEthereumNode newValue ', newValue);
  //   setEthereumNodeConfig(newValue);
  //   // save storage location (and other settings)
  //   setNodeStorageLocation(newValue.storageLocation);

  //   if (
  //     (newValue.executionClient === '' &&
  //       newValue.consensusClient === '' &&
  //       newValue.storageLocation === undefined) ||
  //     sNodeLibrary === undefined
  //   ) {
  //     return;
  //   }

  //   let ecNodeSpec;
  //   let ccNodeSpec;
  //   if (newValue?.executionClient) {
  //     const ecValue = newValue?.executionClient;
  //     if (sNodeLibrary) {
  //       ecNodeSpec = sNodeLibrary?.[ecValue];
  //     }
  //   }
  //   if (newValue?.consensusClient) {
  //     const ccValue = newValue?.consensusClient;
  //     if (sNodeLibrary) {
  //       ccNodeSpec = sNodeLibrary?.[`${ccValue}-beacon`];
  //     }
  //   }
  //   console.log(
  //     'adding nodes with storage location set to: ',
  //     sNodeStorageLocation
  //   );
  //   if (!ecNodeSpec || !ccNodeSpec) {
  //     throw new Error('ecNodeSpec or ccNodeSpec is undefined');
  //     return;
  //   }

  //   modalOnChangeConfig({
  //     ecNodeSpec,
  //     ccNodeSpec,
  //     storageLocation: sNodeStorageLocation,
  //   });
  // };

  const getStepScreen = () => {
    let stepScreen = null;
    let stepImage = step1;
    switch (sStep) {
      case 0:
        stepScreen = (
          <AddEthereumNode
            ethereumNodeConfig={sEthereumNodeConfig}
            setConsensusClient={setConsensusClient}
            setExecutionClient={setExecutionClient}
            setStorageLocation={setStorageLocation}
          />
        );
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
      <button type="button" label="test" onClick={modalOnSaveConfig} />
    </div>
  );
};

export default AddNodeStepperModal;
