import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import electron from '../../electronGlobal';
import { useAppDispatch } from '../../state/hooks';
import { updateSelectedNodePackageId } from '../../state/node';
import AddNodeStepperModal from '../AddNodeStepper/AddNodeStepperModal';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import { modalOnChangeConfig, ModalConfig } from './modalUtils';
import { useGetPodmanDetailsQuery } from '../../state/settingsService';
import { reportEvent } from '../../events/reportEvent';
import { NodePackageSpecification } from '../../../common/nodeSpec';
import { AddNodePackageNodeService } from '../../../main/nodePackageManager';
import {
  NodeLibrary,
  NodePackageLibrary,
} from '../../../main/state/nodeLibrary';
import { mergePackageAndClientConfigValues } from '../AddNodeConfiguration/mergePackageAndClientConfigValues';
import { arePodmanRequirementsMet } from '../AddNodeStepper/podmanRequirements';

type Props = {
  modalOnClose: () => void;
};

export const AddNodeModal = ({ modalOnClose }: Props) => {
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});
  const [sSelectedNodePackageSpec, setSelectedNodePackageSpec] =
    useState<NodePackageSpecification>();
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
    useState<boolean>(false);
  const [step, setStep] = useState(0);
  const [sNodeLibrary, setNodeLibrary] = useState<NodeLibrary>();
  const [sNodePackageLibrary, setNodePackageLibrary] =
    useState<NodePackageLibrary>();
  const { t } = useTranslation();

  // useEffect(() => {}, []);

  useEffect(() => {
    reportEvent('OpenAddNodeModal');
    const fetchNodeLibrarys = async () => {
      const nodePackageLibrary: NodePackageLibrary =
        await electron.getNodePackageLibrary();
      setNodePackageLibrary(nodePackageLibrary);
      const nodeLibrary: NodeLibrary = await electron.getNodeLibrary();
      setNodeLibrary(nodeLibrary);
    };
    fetchNodeLibrarys();
  }, []);

  const qPodmanDetails = useGetPodmanDetailsQuery(null, {
    pollingInterval: 15000,
  });
  const podmanDetails = qPodmanDetails?.data;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (modalConfig?.node && sNodePackageLibrary?.[modalConfig.node]) {
      setSelectedNodePackageSpec(sNodePackageLibrary?.[modalConfig.node]);
      console.log(
        'Node selected and node spec found: ',
        sNodePackageLibrary?.[modalConfig.node],
      );
    }
    console.log('modalConfig useEffect. node', modalConfig.node);
  }, [modalConfig, sNodePackageLibrary]);

  let modalTitle = '';
  switch (step) {
    case 0:
      modalTitle = t('AddYourFirstNode');
      break;
    case 1:
      if (sSelectedNodePackageSpec) {
        modalTitle = t('LaunchAVarNode', {
          nodeName: sSelectedNodePackageSpec.displayName,
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

  const isPodmanRequirementsMet = arePodmanRequirementsMet(podmanDetails);
  const startNode = (step === 2 || step === 3) && isPodmanRequirementsMet;
  const buttonSaveLabel = startNode ? t('StartNode') : t('Continue');
  const buttonCancelLabel = step === 0 ? t('Cancel') : t('Back');
  const buttonSaveVariant = startNode ? 'icon-left' : 'text';

  const modalOnSaveConfig = async (updatedConfig: ModalConfig | undefined) => {
    const {
      node,
      clientSelections,
      clientConfigValues,
      storageLocation,
      nodePackageConfigValues,
    } = updatedConfig || (modalConfig as ModalConfig);

    // uses a state value because they were being overwritten by a bug
    //  in modelConfig and updateModalConfig
    const nodePackageLibrary = sNodePackageLibrary;
    const nodeLibrary = sNodeLibrary;

    console.log('AddNodeModal modalOnSaveConfig(updatedConfig)', updatedConfig);
    // Mostly duplicate code with AddNodeStepper.addNodes()
    let nodePackageSpec: NodePackageSpecification;
    if (nodePackageLibrary && node) {
      nodePackageSpec = nodePackageLibrary?.[node];
    } else {
      console.error('nodePackageLibrary, node: ', nodePackageLibrary, node);
      throw new Error('No Node Package Spec found for the selected node');
    }
    const services: AddNodePackageNodeService[] = [];
    if (nodeLibrary && clientSelections) {
      // eslint-disable-next-line
      for (const [serviceId, selectOption] of Object.entries(
        clientSelections,
      )) {
        console.log(`${serviceId}: ${selectOption}`);
        const clientId = selectOption.value;
        const serviceNodeSpec =
          nodeLibrary?.[clientId] ?? nodeLibrary?.[`${clientId}-beacon`];
        if (!serviceNodeSpec) {
          console.error(
            'No service node spec found when finishing add node flow.',
            serviceId,
            clientId,
          );
          throw new Error(
            'No service node spec found when finishing add node flow.',
          );
        }
        const serviceDefinition = nodePackageSpec.execution.services.find(
          (service) => service.serviceId === serviceId,
        );
        const mergedPackageAndClientConfigValues =
          mergePackageAndClientConfigValues({
            nodePackageSpec,
            nodePackageConfigValues:
              nodePackageConfigValues?.[nodePackageSpec.specId],
            clientConfigValues: clientConfigValues?.[clientId],
            serviceId,
          });
        services.push({
          serviceId,
          serviceName: serviceDefinition?.name ?? serviceId,
          spec: serviceNodeSpec,
          initialConfigValues: mergedPackageAndClientConfigValues,
        });
      }
    }
    const { node: nodePackage } = await electron.addNodePackage(
      nodePackageSpec,
      services,
      {
        storageLocation,
        configValues: nodePackageConfigValues?.[nodePackageSpec.specId],
      },
    );
    console.log('nodePackage result: ', nodePackage);
    const packageNetwork =
      (nodePackageConfigValues?.[nodePackageSpec.specId]?.network as string) ??
      '';
    reportEvent('AddNodePackage', {
      nodePackage: nodePackageSpec.specId,
      clients: services.map((service) => service.spec.specId),
      network: packageNetwork,
    });
    dispatch(updateSelectedNodePackageId(nodePackage.id));

    electron.startNodePackage(nodePackage.id);
  };

  const disableSaveButton = useCallback((value: boolean) => {
    setIsSaveButtonDisabled(value);
  }, []);

  const onCancel = () => {
    if (step === 0) {
      modalOnClose();
    } else {
      setStep(step - 1);
      // set button to enable when podman isn't running/installed, but user goes back
      if (step === 3) {
        setIsSaveButtonDisabled(false);
      }
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
      const isPodmanRequirementsMet = arePodmanRequirementsMet(podmanDetails);
      if (isPodmanRequirementsMet) {
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

  const onSetPodmanInstallDone = () => {
    // refetch podman details to verify podman is installed
    //  which will allow the user to continue.
    //  This is faster than waiting for the qPodmanDetails polling
    qPodmanDetails?.refetch();
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
        nodeLibrary={sNodeLibrary}
        nodePackageLibrary={sNodePackageLibrary}
        setPodmanInstallDone={onSetPodmanInstallDone}
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
