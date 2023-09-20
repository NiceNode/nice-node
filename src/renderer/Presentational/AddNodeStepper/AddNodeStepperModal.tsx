// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';

import { SelectOption } from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import { ModalConfig } from '../ModalManager/modalUtils';
import ContentWithSideArt from '../../Generics/redesign/ContentWithSideArt/ContentWithSideArt';
import { componentContainer, container } from './addNodeStepper.css';
import AddEthereumNode, {
  AddEthereumNodeValues,
} from '../AddEthereumNode/AddEthereumNode';
import NodeRequirements from '../NodeRequirements/NodeRequirements';
import { SystemData } from '../../../main/systemInfo';
import { SystemRequirements } from '../../../common/systemRequirements';
import electron from '../../electronGlobal';
import { mergeSystemRequirements } from './mergeNodeRequirements';

import step1 from '../../assets/images/artwork/NN-Onboarding-Artwork-01.png';
import step2 from '../../assets/images/artwork/NN-Onboarding-Artwork-02.png';
import step3 from '../../assets/images/artwork/NN-Onboarding-Artwork-03.png';
import PodmanInstallation from '../PodmanInstallation/PodmanInstallation';
import AddNode, { AddNodeValues } from '../AddNode/AddNode';
import AddBaseNode from '../AddBaseNode/AddBaseNode';
import AddNodeConfiguration, {
  AddNodeConfigurationValues,
} from '../AddNodeConfiguration/AddNodeConfiguration';

export interface AddNodeStepperModalProps {
  modal?: boolean;
  modalConfig: ModalConfig;
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  step: number;
  disableSaveButton: (value: boolean) => void;
  setIsPodmanRunning: (value: boolean) => void;
}

const AddNodeStepperModal = ({
  modal = false,
  modalConfig,
  modalOnChangeConfig,
  step,
  disableSaveButton,
  setIsPodmanRunning,
}: AddNodeStepperModalProps) => {
  const [sNodeConfig, setNodeConfig] = useState<AddNodeValues>();
  const [sEthereumNodeConfig, setEthereumNodeConfig] =
    useState<AddEthereumNodeValues>();
  const [sEthereumNodeRequirements, setEthereumNodeRequirements] =
    useState<SystemRequirements>();
  const [sSystemData, setSystemData] = useState<SystemData>();

  const getData = async () => {
    setSystemData(await electron.getSystemInfo());
  };

  useEffect(() => {
    getData();
  }, []);

  const onChangeAddNodeConfiguration = (
    newValue: AddNodeConfigurationValues,
  ) => {
    console.log(
      'AddNodeStepperModal onChangeAddNodeConfiguration called. newValue',
      newValue,
    );
    const config = {
      ...sEthereumNodeConfig,
      clientSelections: newValue.clientSelections,
    };
    modalOnChangeConfig({
      clientSelections: newValue.clientSelections,
    });
    setEthereumNodeConfig(config);
  };

  useEffect(() => {
    const { nodeLibrary, clientSelections, storageLocation } = modalConfig;
    if (nodeLibrary && clientSelections && storageLocation) {
      const reqs: SystemRequirements[] = [];
      // eslint-disable-next-line
      for (const [serviceId, selectOption] of Object.entries(
        clientSelections,
      )) {
        console.log(`${serviceId}: ${selectOption}`);
        const clientId = selectOption.value;
        if (nodeLibrary?.[clientId]?.systemRequirements) {
          reqs.push(
            nodeLibrary[clientId].systemRequirements as SystemRequirements,
          );
        } else if (nodeLibrary?.[`${clientId}-beacon`]?.systemRequirements) {
          // todo: remove this. Special case for legacy ethereum node
          reqs.push(
            nodeLibrary[`${clientId}-beacon`]
              .systemRequirements as SystemRequirements,
          );
        }
      }
      try {
        const mergedReqs = mergeSystemRequirements(reqs);
        console.log('mergedReqs', mergedReqs);
        setEthereumNodeRequirements(mergedReqs);
      } catch (e) {
        console.error(e);
      }
    }
  }, [modalConfig]);

  const setConsensusClient = (
    clClient: SelectOption,
    ethereumNodeConfig: AddEthereumNodeValues,
  ) => {
    const config = { ...ethereumNodeConfig, consensusClient: clClient };
    modalOnChangeConfig({
      consensusClient: clClient.value,
    });
    setEthereumNodeConfig(config);
  };

  const setExecutionClient = (
    elClient: SelectOption,
    ethereumNodeConfig: AddEthereumNodeValues,
  ) => {
    console.log('setExecutionClient called', elClient, ethereumNodeConfig);
    const config = { ...ethereumNodeConfig, executionClient: elClient };
    modalOnChangeConfig({
      executionClient: elClient.value,
    });
    setEthereumNodeConfig(config);
  };

  const setNode = (
    nodeSelectOption: SelectOption,
    nodeConfig: AddNodeValues,
  ) => {
    const config = { ...nodeConfig, node: nodeSelectOption };
    console.log('AddNodeStepperModal calling modalOnChangeConfig()', {
      node: nodeSelectOption.value,
    });
    modalOnChangeConfig({
      ...nodeConfig,
      node: nodeSelectOption.value,
    });
    // clear step 1 (client selections) when user changes node (package)
    setEthereumNodeConfig(undefined);
    console.log('AddNodeStepperModal setNode: config', config);
    setNodeConfig(config);
  };

  const onChangeDockerInstall = useCallback((newValue: string) => {
    console.log('onChangeDockerInstall newValue ', newValue);
    disableSaveButton(false);
    if (newValue === 'done') {
      setIsPodmanRunning(true);
      disableSaveButton(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStepScreen = () => {
    let stepScreen = null;
    let stepImage = step1;
    switch (step) {
      case 0:
        stepScreen = (
          <AddNode
            nodeConfig={sNodeConfig}
            setNode={setNode}
            modalOnChangeConfig={modalOnChangeConfig}
          />
        );
        stepImage = step1;
        break;
      case 1:
        if (sNodeConfig?.node?.value === 'base2') {
          stepScreen = (
            <AddBaseNode
              ethereumNodeConfig={sEthereumNodeConfig}
              setConsensusClient={setConsensusClient}
              setExecutionClient={setExecutionClient}
              modalOnChangeConfig={modalOnChangeConfig}
            />
          );
        } else if (sNodeConfig?.node?.value === 'ethereum2') {
          stepScreen = (
            <AddEthereumNode
              ethereumNodeConfig={sEthereumNodeConfig}
              setConsensusClient={setConsensusClient}
              setExecutionClient={setExecutionClient}
              modalOnChangeConfig={modalOnChangeConfig}
            />
          );
        } else {
          stepScreen = (
            <AddNodeConfiguration
              nodeId={sNodeConfig?.node?.value}
              nodePackageConfig={sEthereumNodeConfig}
              onChange={onChangeAddNodeConfiguration}
              modalOnChangeConfig={modalOnChangeConfig}
            />
          );
        }

        stepImage = step1;
        break;
      case 2:
        stepScreen = (
          <NodeRequirements
            type="modal"
            nodeRequirements={sEthereumNodeRequirements}
            systemData={sSystemData}
            nodeStorageLocation={modalConfig?.storageLocation}
          />
        );
        stepImage = step2;
        break;
      case 3:
        stepScreen = (
          <PodmanInstallation
            disableSaveButton={disableSaveButton}
            onChange={onChangeDockerInstall}
            type="modal"
          />
        );
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

  const modalStyle = modal ? 'modal' : '';

  return (
    <div className={[container, modalStyle].join(' ')}>
      <div className={componentContainer}>{getStepScreen()}</div>
    </div>
  );
};

export default AddNodeStepperModal;
