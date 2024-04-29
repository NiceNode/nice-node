// This component could be made into a Generic "FullScreenStepper" component
// Just make sure to always render each child so that children component state isn't cleard
import { useCallback, useEffect, useState } from 'react';

import type { SystemRequirements } from '../../../common/systemRequirements';
import type {
  NodeLibrary,
  NodePackageLibrary,
} from '../../../main/state/nodeLibrary';
import type { SelectOption } from '../../Generics/redesign/SpecialSelect/SpecialSelect';
import AddNode, { type AddNodeValues } from '../AddNode/AddNode';
import AddNodeConfiguration, {
  type AddNodeConfigurationValues,
} from '../AddNodeConfiguration/AddNodeConfiguration';
import type { ModalConfig } from '../ModalManager/modalUtils';
import NodeRequirements from '../NodeRequirements/NodeRequirements';
import PodmanInstallation from '../PodmanInstallation/PodmanInstallation';
import { componentContainer, container } from './addNodeStepper.css';
import { mergeSystemRequirements } from './mergeNodeRequirements';

export interface AddNodeStepperModalProps {
  modal?: boolean;
  modalConfig: ModalConfig;
  modalOnChangeConfig: (config: ModalConfig, save?: boolean) => void;
  nodeLibrary?: NodeLibrary;
  nodePackageLibrary?: NodePackageLibrary;
  step: number;
  disableSaveButton: (value: boolean) => void;
  setPodmanInstallDone: (value: boolean) => void;
}

const AddNodeStepperModal = ({
  modal = false,
  modalConfig,
  modalOnChangeConfig,
  nodeLibrary,
  nodePackageLibrary,
  step,
  disableSaveButton,
  setPodmanInstallDone,
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
    [],
  );

  const onChangeDockerInstall = useCallback((newValue: string) => {
    console.log('onChangeDockerInstall newValue ', newValue);
    disableSaveButton(false);
    if (newValue === 'done') {
      setPodmanInstallDone(true);
      disableSaveButton(false);
    }
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
            nodePackageLibrary={nodePackageLibrary}
            nodeStorageLocation={sEthereumNodeConfig?.storageLocation}
            onChange={onChangeAddNodeConfiguration}
            disableSaveButton={disableSaveButton}
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
