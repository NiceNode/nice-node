import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../state/hooks';
import { getModalState, setModalState } from '../../state/modal';
import { AddNodeModal } from './AddNodeModal';
import { AlphaBuildModal } from './AlphaBuildModal';
import FailSystemRequirementsModal from './FailSystemRequirementsModal';
import { NodeSettingsModal } from './NodeSettingsModal';
import { PreferencesModal } from './PreferencesModal';
import { RemoveNodeModal } from './RemoveNodeModal';
import { ResetConfigModal } from './ResetConfigModal';
import { modalRoutes } from './modalUtils';
import { CartridgeUpdateModal } from './CartridgeUpdateModal.js';

const ModalManager = () => {
  const { isModalOpen, screen } = useSelector(getModalState);
  const dispatch = useAppDispatch();

  const modalOnClose = useCallback(() => {
    dispatch(
      setModalState({
        isModalOpen: false,
        screen: { route: undefined, type: undefined },
      }),
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
    case modalRoutes.cartridgeUpdate:
      return <CartridgeUpdateModal modalOnClose={modalOnClose} />;
    case modalRoutes.nodeSettings:
      return <NodeSettingsModal modalOnClose={modalOnClose} />;
    case modalRoutes.preferences:
      return <PreferencesModal modalOnClose={modalOnClose} />;
    case modalRoutes.failSystemRequirements:
      return <FailSystemRequirementsModal modalOnClose={modalOnClose} />;
    case modalRoutes.addValidator:
      return null;
    case modalRoutes.clientVersions:
      return null;

    // Info
    case modalRoutes.alphaBuild:
      return <AlphaBuildModal modalOnClose={modalOnClose} />;

    // Alerts
    case modalRoutes.stopNode:
      return null;
    case modalRoutes.removeNode:
      return <RemoveNodeModal modalOnClose={modalOnClose} />;
    case modalRoutes.resetConfig:
      return <ResetConfigModal modalOnClose={modalOnClose} />;
    case modalRoutes.updateUnavailable:
      return null;
    default:
      return null;
  }
};

export default ModalManager;
