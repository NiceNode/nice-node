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
import DockerInstallation from '../DockerInstallation/DockerInstallation';
import NodeRequirements from '../NodeRequirements/NodeRequirements';
import { SystemData } from '../../../main/systemInfo';
import { SystemRequirements } from '../../../common/systemRequirements';
import electron from '../../electronGlobal';
import { mergeSystemRequirements } from './mergeNodeRequirements';

import step1 from '../../assets/images/artwork/NN-Onboarding-Artwork-01.png';
import step2 from '../../assets/images/artwork/NN-Onboarding-Artwork-02.png';
import step3 from '../../assets/images/artwork/NN-Onboarding-Artwork-03.png';

export interface AddNodeStepperModalProps {
  modal?: boolean;
  modalConfig: ModalConfig;
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  step: number;
  disableSaveButton: (value: boolean) => void;
}

const AddNodeStepperModal = ({
  modal = false,
  modalConfig,
  modalOnChangeConfig,
  step,
  disableSaveButton,
}: AddNodeStepperModalProps) => {
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

  useEffect(() => {
    const {
      nodeLibrary,
      consensusClient = 'nimbus',
      executionClient = 'besu',
      storageLocation,
    } = modalConfig;
    if (nodeLibrary && consensusClient && executionClient && storageLocation) {
      const ecReqs = nodeLibrary?.[executionClient]?.systemRequirements;
      const ccReqs =
        nodeLibrary?.[`${consensusClient}-beacon`]?.systemRequirements;
      try {
        if (ecReqs && ccReqs) {
          const mergedReqs = mergeSystemRequirements([ecReqs, ccReqs]);
          console.log('mergedReqs', mergedReqs);
          setEthereumNodeRequirements(mergedReqs);
        } else {
          throw new Error('ec or ec node requirements undefined');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [modalConfig]);

  const setConsensusClient = (
    clClient: SelectOption,
    ethereumNodeConfig: AddEthereumNodeValues
  ) => {
    const config = { ...ethereumNodeConfig, consensusClient: clClient };
    modalOnChangeConfig({
      consensusClient: clClient.value,
    });
    setEthereumNodeConfig(config);
  };

  const setExecutionClient = (
    elClient: SelectOption,
    ethereumNodeConfig: AddEthereumNodeValues
  ) => {
    const config = { ...ethereumNodeConfig, executionClient: elClient };
    modalOnChangeConfig({
      executionClient: elClient.value,
    });
    setEthereumNodeConfig(config);
  };

  const onChangeDockerInstall = useCallback((newValue: string) => {
    console.log('onChangeDockerInstall newValue ', newValue);
    disableSaveButton(false);
    if (newValue === 'done') {
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
          <AddEthereumNode
            ethereumNodeConfig={sEthereumNodeConfig}
            setConsensusClient={setConsensusClient}
            setExecutionClient={setExecutionClient}
            modalOnChangeConfig={modalOnChangeConfig}
          />
        );
        stepImage = step1;
        break;
      case 1:
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
      case 2:
        stepScreen = (
          <DockerInstallation
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
