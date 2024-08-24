import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NodePackage } from '../../../common/node';
import type { ModalConfig } from '../ModalManager/modalUtils';
import {
  container,
  statusContainer,
  statusIcon,
  successIcon,
  loadingIcon,
  statusText,
  statusButton,
} from './update.css';
import { UpdateCallout } from '../../Generics/redesign/UpdateCallout/UpdateCallout.js';
import Button from '../../Generics/redesign/Button/Button.js';
import { Icon } from '../../Generics/redesign/Icon/Icon.js';
import type { NodeOverviewProps } from '../../Generics/redesign/consts.js';
import { useAppDispatch } from '../../state/hooks.js';
import { setModalState } from '../..//state/modal.js';
import { modalRoutes } from '../ModalManager/modalUtils.js';

export interface UpdateProps {
  updateStatus: string; // The current status of the update process
  isUpdating: boolean; // A flag indicating whether an update is in progress
  onUpdate: () => void; // A callback function to initiate the update process
  modalOnClose: () => void; // A callback function to close the modal
  nodeOverview: NodeOverviewProps; // The overview details of the node being updated
}

const Update = ({
  updateStatus,
  isUpdating,
  onUpdate,
  nodeOverview,
  modalOnClose,
}: UpdateProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { name, displayName, documentation } = nodeOverview;

  // Define the icon, status message, and button label based on the current update status
  const iconClass =
    updateStatus === 'checking'
      ? loadingIcon
      : updateStatus === 'latestVersion' ||
          updateStatus === 'successfullyUpdated'
        ? successIcon
        : null;

  const status = (() => {
    switch (updateStatus) {
      case 'checking':
        return t('CheckingForUpdates');
      case 'latestVersion':
        return t('RunningLatestVersion');
      case 'successfullyUpdated':
        return t('SuccessfullyUpdated');
      default:
        return '';
    }
  })();

  const buttonLabel = (() => {
    switch (updateStatus) {
      case 'checking':
        return t('Cancel');
      case 'latestVersion':
        return t('Close');
      case 'successfullyUpdated':
        return t('Done');
      default:
        return '';
    }
  })();

  return (
    <div className={container}>
      {updateStatus === 'updateAvailable' ? (
        <UpdateCallout
          serviceName={displayName || name}
          releaseNotesUrl={documentation?.releaseNotesUrl}
          onClickShowChanges={() => {
            dispatch(
              setModalState({
                isModalOpen: true,
                screen: {
                  route: modalRoutes.controllerUpdate,
                  type: 'modal',
                },
              }),
            );
          }}
          onClickInstallUpdate={onUpdate}
        />
      ) : (
        <div className={statusContainer}>
          {iconClass && (
            <div className={statusIcon}>
              <div className={iconClass}>
                <Icon
                  iconId={
                    updateStatus === 'checking'
                      ? 'spinnerendless'
                      : 'checkcirclefilled'
                  }
                />
              </div>
            </div>
          )}
          <div className={statusText}>{status}</div>
          <div className={statusButton}>
            <Button
              type={'secondary'}
              size={'small'}
              label={buttonLabel}
              wide={true}
              onClick={modalOnClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Update;
