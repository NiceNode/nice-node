import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import electron from '../../electronGlobal';
import { useAppDispatch } from '../../state/hooks';
import { updateSelectedNodePackageId } from '../../state/node';
import AddNodeStepperModal from '../AddNodeStepper/AddNodeStepperModal';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';
import { useGetIsPodmanRunningQuery } from '../../state/settingsService';
import { reportEvent } from '../../events/reportEvent';
import { NodePackageSpecification, NodeSpecification } from 'common/nodeSpec';
import { AddNodePackageNodeService } from 'main/nodePackageManager';

type Props = {
  modalOnClose: () => void;
};

export const AddNodeModal = ({ modalOnClose }: Props) => {
  const { t } = useTranslation();
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const [sSelectedNodeSpec, setSelectedNodeSpec] =
    useState<NodeSpecification>();
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
    useState<boolean>(false);
  const [sIsPodmanRunning, setIsPodmanRunning] = useState<boolean>(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    reportEvent('OpenAddNodeModal');
  }, []);

  const qIsPodmanRunning = useGetIsPodmanRunningQuery();
  const isPodmanRunning = qIsPodmanRunning?.data;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      modalConfig?.node &&
      modalConfig?.nodePackageLibrary?.[modalConfig.node]
    ) {
      setSelectedNodeSpec(modalConfig?.nodePackageLibrary?.[modalConfig.node]);
      console.log(
        'Node selected and node spec found: ',
        modalConfig?.nodePackageLibrary?.[modalConfig.node],
      );
    }
  }, [modalConfig]);

  let modalTitle = '';
  switch (step) {
    case 0:
      modalTitle = t('AddYourFirstNode');
      break;
    case 1:
      if (sSelectedNodeSpec) {
        modalTitle = t('LaunchAVarNode', {
          nodeName: sSelectedNodeSpec.displayName,
        });
      } else {
        modalTitle = t('LaunchAnEthereumNode');
      }
      break;
    case 2:
      modalTitle = t('NodeRequirements');
      break;
    case 3:
      modalTitle = t('PodmanInstallation');
      break;
    default:
  }

  const startNode =
    (step === 2 || step === 3) && (isPodmanRunning || sIsPodmanRunning);
  const buttonSaveLabel = startNode ? 'Start node' : 'Continue';
  const buttonCancelLabel = step === 0 ? 'Cancel' : 'Back';
  const buttonSaveVariant = startNode ? 'icon-left' : 'text';

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const {
      node,
      executionClient,
      consensusClient,
      storageLocation,
      nodeLibrary,
      nodePackageLibrary,
    } = updatedConfig || (modalConfig as ModalConfig);

    console.log('AddNodeModal modalOnSaveConfig(updatedConfig)', updatedConfig);
    // todo: add logic for Node change (ethereum, base, etc.)
    let nodePackageSpec: NodePackageSpecification;
    if (nodePackageLibrary && node) {
      nodePackageSpec = nodePackageLibrary?.[node];
    } else {
      console.error('nodePackageLibrary, node: ', nodePackageLibrary, node);
      throw new Error('No Node Package Spec found for the selected node');
    }
    let services: AddNodePackageNodeService[] = [];
    // todo: take nodeSpecId and parse out the node spec from the library
    // use that to create the services array (todo: this should be done from selections screen)
    // Node Selections logic
    let ecNodeSpec;
    let ccNodeSpec;
    if (nodeLibrary && executionClient && consensusClient) {
      ecNodeSpec = nodeLibrary?.[executionClient];
      ccNodeSpec =
        nodeLibrary?.[consensusClient] ??
        nodeLibrary?.[`${consensusClient}-beacon`];
      services = [
        {
          serviceId: 'executionClient',
          serviceName: 'Execution Client',
          spec: ecNodeSpec,
        },
        {
          serviceId: 'consensusClient',
          serviceName: 'Consensus Client',
          spec: ccNodeSpec,
        },
      ];
    }

    if (!ecNodeSpec || !ccNodeSpec) {
      throw new Error('ecNodeSpec or ccNodeSpec is undefined');
    }

    // eslint-disable-next-line no-case-declarations
    // TODO: call back-end addNode(nodeSpec (eth or base), nodeSelections (ec & cc), nodeSettings (storageLocation, network))
    // const { ecNode, ccNode } = await electron.addEthereumNode(
    //   ecNodeSpec,
    //   ccNodeSpec,
    //   { storageLocation },
    // );
    // todo: loop over service selections by the user. for now hardcode ec & cc selections
    const { node: nodePackage } = await electron.addNodePackage(
      nodePackageSpec,
      services,
      { storageLocation },
    );
    console.log('nodePackage result: ', nodePackage);
    reportEvent('AddNode');
    dispatch(updateSelectedNodePackageId(nodePackage.id));

    // todo2: call start node package

    // await electron.startNode(ecNode.id);
    // await electron.startNode(ccNode.id);
  };

  const disableSaveButton = useCallback((value: boolean) => {
    setIsSaveButtonDisabled(value);
  }, []);

  const onCancel = () => {
    if (step === 0) {
      modalOnClose();
    } else {
      setStep(step - 1);
    }
  };

  const onSave = () => {
    // From AddNode screen, advance NodeSelections (client selections & settings) screen
    if (step === 0) {
      setStep(1);
      // advance to NodeRequirements checklist screen
    } else if (step === 1) {
      setStep(2);
      // optionally advance to Podman screen (install or start)
    } else if (step === 2) {
      if (isPodmanRunning || sIsPodmanRunning) {
        modalOnSaveConfig(undefined);
        modalOnClose();
      } else {
        setStep(3);
      }
      // Advance to Add and start node, close modal
    } else {
      modalOnSaveConfig(undefined);
      modalOnClose();
    }
  };

  return (
    <Modal
      modalTitle={modalTitle}
      modalStyle="addNode"
      buttonSaveLabel={buttonSaveLabel}
      buttonSaveVariant={buttonSaveVariant}
      buttonSaveIcon="play"
      buttonCancelLabel={buttonCancelLabel}
      modalOnSaveConfig={onSave}
      modalOnClose={modalOnClose}
      modalOnCancel={onCancel}
      isSaveButtonDisabled={isSaveButtonDisabled}
    >
      <AddNodeStepperModal
        step={step}
        setIsPodmanRunning={setIsPodmanRunning}
        modal
        modalConfig={modalConfig}
        modalOnChangeConfig={(config, save) => {
          modalOnChangeConfig(
            config,
            modalConfig,
            setModalConfig,
            save,
            modalOnSaveConfig,
          );
        }}
        disableSaveButton={disableSaveButton}
      />
    </Modal>
  );
};
