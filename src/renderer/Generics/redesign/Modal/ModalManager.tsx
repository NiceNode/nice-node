import { useSelector } from 'react-redux';
import { useAppDispatch } from 'renderer/state/hooks';
import AddNodeStepper from 'renderer/Presentational/AddNodeStepper/AddNodeStepper';
import PreferencesWrapper from 'renderer/Presentational/Preferences/PreferencesWrapper';
import { useTranslation } from 'react-i18next';
import NodeSettingsWrapper from 'renderer/Presentational/NodeSettings/NodeSettingsWrapper';
import RemoveNodeWrapper, {
  RemoveNodeAction,
} from 'renderer/Presentational/RemoveNodeModal/RemoveNodeWrapper';
import { getModalState, setModalState } from '../../../state/modal';
import { ModalNew } from './ModalNew';

const ModalManager = () => {
  const dispatch = useAppDispatch();
  const { isModalOpen, screen } = useSelector(getModalState);
  const { t } = useTranslation('genericComponents');

  if (!isModalOpen) {
    return null;
  }

  const resetModal = () => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
      })
    );
  };

  let modalContent = <></>;
  let modalProps = {};
  // Render the appropriate screen based on the current `screen` value
  switch (screen.route) {
    // Modals
    case 'addNode':
      modalProps = { isFullScreen: true, type: 'stepper', title: '' };
      modalContent = (
        <AddNodeStepper
          modal
          onChange={(newValue: 'done' | 'cancel') => {
            if (newValue === 'done' || newValue === 'cancel') {
              resetModal();
            }
          }}
        />
      );
      break;
    case 'nodeSettings':
      modalProps = { title: t('NodeSettings'), type: 'settings' };
      modalContent = <NodeSettingsWrapper onClickClose={() => resetModal()} />;
      break;
    case 'preferences':
      modalProps = { title: t('Preferences') };
      modalContent = <PreferencesWrapper isOpen onClose={() => resetModal()} />;
      break;
    case 'addValidator':
      modalContent = <>Add Validator</>;
      break;
    case 'clientVersions':
      modalContent = <>Client Versions</>;
      break;

    // Alerts
    case 'stopNode':
      modalContent = <>Stop Node</>;
      break;
    case 'removeNode':
      modalProps = { title: t('RemoveNode') };
      modalContent = (
        <RemoveNodeWrapper
          isOpen
          onClose={(action: RemoveNodeAction) => {
            if (action === 'remove') {
              resetModal();
            } else {
              dispatch(
                setModalState({
                  isModalOpen: true,
                  screen: { route: 'nodeSettings', type: 'modal' },
                })
              );
            }
          }}
        />
      );
      break;
    case 'updateUnvailable':
      modalContent = <>Update unavailable</>;
      break;
    default:
  }

  return (
    <ModalNew {...modalProps} isOpen onClickCloseButton={() => resetModal()}>
      {modalContent}
    </ModalNew>
  );
};

export default ModalManager;
