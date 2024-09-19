import { useEffect, useState } from 'react';
import { useAppSelector } from '../../state/hooks';
import { selectSelectedNodePackage } from '../../state/node';
import type { ModalConfig } from '../ModalManager/modalUtils';
import Update from './Update';
import type { NodeOverviewProps } from '../../Generics/redesign/consts.js';
import electron from '../../../renderer/electronGlobal.js';

export interface UpdateWrapperProps {
  modalOnClose: () => void;
  deeplink: string;
  nodeOverview: NodeOverviewProps;
}

const UpdateWrapper = ({
  modalOnClose,
  deeplink,
  nodeOverview,
}: UpdateWrapperProps) => {
  const [updateStatus, setUpdateStatus] = useState<string>('checking');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const isUpdateAvailable = async () => {
    const isAvailable = await electron.getCheckForControllerUpdate(
      nodeOverview.nodeId,
    );
    setTimeout(() => {
      setUpdateStatus(isAvailable ? 'updateAvailable' : 'latestVersion');
    }, 1000);
  };

  useEffect(() => {
    console.log('deeplink', deeplink);
    if (deeplink === 'update') {
      setUpdateStatus('updateAvailable');
    } else if (deeplink === 'check') {
      isUpdateAvailable();
    }
  }, [deeplink]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await electron.applyNodeUpdate(nodeOverview.nodeId);
    setIsUpdating(false);
    setUpdateStatus('successfullyUpdated');
  };

  return (
    <Update
      updateStatus={updateStatus}
      isUpdating={isUpdating}
      onUpdate={handleUpdate}
      modalOnClose={modalOnClose}
      nodeOverview={nodeOverview}
    />
  );
};

export default UpdateWrapper;
