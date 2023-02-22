import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useAppDispatch } from '../../../state/hooks';
import { getModalState, setModalState } from '../../../state/modal';
import { modalRoutes } from './modalUtils';
import { NodeSettingsModal } from './NodeSettingsModal';
import { PreferencesModal } from './PreferencesModal';
import { RemoveNodeModal } from './RemoveNodeModal';
import { AddNodeModal } from './AddNodeModal';

const ModalManager = () => {
  const { isModalOpen, screen } = useSelector(getModalState);
  const dispatch = useAppDispatch();

  const modalOnClose = useCallback(() => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
      })
    );
  }, [dispatch]);

  if (!isModalOpen) {
    return null;
  }

  // Render the appropriate screen based on the current `screen` value
  switch (screen.route) {
    // Modals
    case modalRoutes.addNode:
      return <AddNodeModal modalOnClose={modalOnClose} />;
    case modalRoutes.nodeSettings:
      return <NodeSettingsModal modalOnClose={modalOnClose} />;
    case modalRoutes.preferences:
      return <PreferencesModal modalOnClose={modalOnClose} />;
    case modalRoutes.addValidator:
      return null;
    case modalRoutes.clientVersions:
      return null;

    // Alerts
    case modalRoutes.stopNode:
      return null;
    case modalRoutes.removeNode:
      return <RemoveNodeModal modalOnClose={modalOnClose} />;
    case modalRoutes.updateUnavailable:
      return null;
    default:
      return null;
  }
};

export default ModalManager;
