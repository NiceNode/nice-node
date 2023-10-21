// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';

import { SelectOption } from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import { ModalConfig } from '../ModalManager/modalUtils';
import { componentContainer, container } from './addNodeStepper.css';
import NodeRequirements from '../NodeRequirements/NodeRequirements';
import { SystemRequirements } from '../../../common/systemRequirements';
import electron from '../../electronGlobal';
import { mergeSystemRequirements } from './mergeNodeRequirements';
import PodmanInstallation from '../PodmanInstallation/PodmanInstallation';
import AddNode, { AddNodeValues } from '../AddNode/AddNode';
import AddNodeConfiguration, {
  AddNodeConfigurationValues,
} from '../AddNodeConfiguration/AddNodeConfiguration';
import { NodeLibrary } from '../../../main/state/nodeLibrary';

export interface AddNodeStepperModalProps {
  modal?: boolean;
  modalConfig: ModalConfig;
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  nodeLibrary: NodeLibrary;
  step: number;
  disableSaveButton: (value: boolean) => void;
  setIsPodmanRunning: (value: boolean) => void;
}

const AddNodeStepperModal = ({
  modal = false,
  modalConfig,
  modalOnChangeConfig,
  nodeLibrary,
  step,
  disableSaveButton,
  setIsPodmanRunning,
}: AddNodeStepperModalProps) => {
  const [sNodeConfig, setNodeConfig] = useState<AddNodeValues>();
  const [sEthereumNodeConfig, setEthereumNodeConfig] =
    useState<AddNodeConfigurationValues>();
  const [sNodeRequirements, setNodeRequirements] =
    useState<SystemRequirements>();

  const onChangeAddNodeConfiguration = (
    newValue: AddNodeConfigurationValues,
  ) => {
    console.log(
      'AddNodeStepperModal onChangeAddNodeConfiguration called. newValue',
      newValue,
    );
    const config = {
      ...sEthereumNodeConfig,
      ...newValue,
    };
    modalOnChangeConfig({
      ...modalConfig,
      ...newValue,
    });
    setEthereumNodeConfig(config);
  };

  useEffect(() => {
    const { clientSelections, storageLocation } = modalConfig;
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
        setNodeRequirements(mergedReqs);
      } catch (e) {
        console.error(e);
      }
    }
  }, [modalConfig, nodeLibrary]);

  const setNode = useCallback(
    (nodeSelectOption: SelectOption, nodeConfig: AddNodeValues) => {
      const config = { ...nodeConfig, node: nodeSelectOption };
      console.log('AddNodeStepperModal calling modalOnChangeConfig()', {
        ...modalConfig,
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
    switch (step) {
      case 0:
        stepScreen = (
          <AddNode nodeConfig={sNodeConfig} setNode={setNode} shouldHideTitle />
        );
        break;
      case 1:
        stepScreen = (
          <AddNodeConfiguration
            nodeId={sNodeConfig?.node?.value}
            nodeLibrary={nodeLibrary}
            nodePackageConfig={sEthereumNodeConfig}
            onChange={onChangeAddNodeConfiguration}
            shouldHideTitle
          />
        );
        break;
      case 2:
        stepScreen = (
          <NodeRequirements
            type="modal"
            nodeRequirements={sNodeRequirements}
            nodeStorageLocation={modalConfig?.storageLocation}
          />
        );
        break;
      case 3:
        stepScreen = (
          <PodmanInstallation
            disableSaveButton={disableSaveButton}
            onChange={onChangeDockerInstall}
            type="modal"
          />
        );
        break;
      default:
    }

    return <div style={{ height: '100%' }}>{stepScreen}</div>;
  };

  const modalStyle = modal ? 'modal' : '';

  return (
    <div className={[container, modalStyle].join(' ')}>
      <div className={componentContainer}>{getStepScreen()}</div>
    </div>
  );
};

export default AddNodeStepperModal;
