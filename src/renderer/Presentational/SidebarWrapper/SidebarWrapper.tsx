import {
  type ReactElement,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { NodeId } from 'src/common/node.js';
import { CHANNELS } from '../../../main/messenger';
import type { NotificationItemProps } from '../../Generics/redesign/NotificationItem/NotificationItem';
import electron from '../../electronGlobal';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { setModalState } from '../../state/modal.js';
import { useGetNetworkConnectedQuery } from '../../state/network';
import {
  selectSelectedNodePackageId,
  selectUserNodePackages,
  updateSelectedNodePackageId,
} from '../../state/node';
import { useGetNotificationsQuery } from '../../state/notificationsService';
import {
  useGetIsPodmanInstalledQuery,
  useGetIsPodmanRunningQuery,
  useGetPodmanDetailsQuery,
} from '../../state/settingsService';
import { modalRoutes } from '../ModalManager/modalUtils.js';
import Sidebar from '../Sidebar/Sidebar';

export interface SidebarWrapperProps {
  children: ReactElement;
}

export const SidebarWrapper = forwardRef<HTMLDivElement>((_, ref) => {
  const sSelectedNodePackageId = useAppSelector(selectSelectedNodePackageId);
  const sUserNodePackages = useAppSelector(selectUserNodePackages);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // todo: implement a back-off polling strategy which can be "reset"
  const qIsPodmanInstalled = useGetIsPodmanInstalledQuery();
  const isPodmanInstalled = qIsPodmanInstalled?.data;
  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: 15000,
  });
  const qNetwork = useGetNetworkConnectedQuery(null, {
    pollingInterval: 30000,
  });
  const qPodmanDetails = useGetPodmanDetailsQuery(null, {
    pollingInterval: 15000,
  });
  const podmanDetails = qPodmanDetails?.data;
  const [platform, setPlatform] = useState<string>('');
  // default to docker is running while data is being fetched, so
  //  the user isn't falsely warned
  let isPodmanRunning = true;
  if (qIsPodmanRunning && !qIsPodmanRunning.fetching) {
    isPodmanRunning = qIsPodmanRunning.data;
  }

  const onClickInstallPodman = async () => {
    dispatch(
      setModalState({
        isModalOpen: true,
        screen: {
          route: modalRoutes.podman,
          type: 'modal',
          data: { view: 'update' },
        },
      }),
    );
  };

  const onClickStartPodman = async () => {
    await electron.startPodman();
    // todo: verify it is started and changed banner for 5 secs?
    qIsPodmanRunning.refetch();
    // console.log('installPodman finished. Install result: ', installResult);
  };

  const qNotifications = useGetNotificationsQuery();
  const notifications: NotificationItemProps[] = qNotifications?.data;

  // subscribes to a channel which notifies when dark mode settings change
  const onNotificationChange = useCallback(() => {
    console.log('onNotificationChange');
    qNotifications?.refetch();
  }, []);

  const onOpenPodmanModal = useCallback(() => {
    dispatch(
      setModalState({
        isModalOpen: true,
        screen: {
          route: modalRoutes.podman,
          type: 'modal',
        },
      }),
    );
  }, []);

  const onOpenNodePackageScreen = useCallback((nodeId: NodeId) => {
    navigate('/main/nodePackage');
    dispatch(updateSelectedNodePackageId(nodeId));
  }, []);

  useEffect(() => {
    electron.ipcRenderer.on(CHANNELS.notifications, onNotificationChange);
    electron.ipcRenderer.on(CHANNELS.openPodmanModal, onOpenPodmanModal);
    electron.ipcRenderer.on(
      CHANNELS.openNodePackageScreen,
      onOpenNodePackageScreen,
    );
    return () => {
      electron.ipcRenderer.removeListener(
        CHANNELS.notifications,
        onNotificationChange,
      );
      electron.ipcRenderer.removeListener(
        CHANNELS.openPodmanModal,
        onOpenPodmanModal,
      );
      electron.ipcRenderer.removeListener(
        CHANNELS.openNodePackageScreen,
        onOpenNodePackageScreen,
      );
    };
  }, [onNotificationChange, onOpenPodmanModal, onOpenNodePackageScreen]);

  // Default selected node to be the first node
  useEffect(() => {
    if (
      !sSelectedNodePackageId &&
      sUserNodePackages &&
      Array.isArray(sUserNodePackages?.nodeIds) &&
      sUserNodePackages.nodeIds.length > 0
    ) {
      dispatch(updateSelectedNodePackageId(sUserNodePackages.nodeIds[0]));
    }
  }, [sSelectedNodePackageId, sUserNodePackages, dispatch]);

  useEffect(() => {
    const asyncData = async () => {
      const userSettings = await electron.getSettings();
      setPlatform(userSettings.osPlatform || '');
    };
    asyncData();
  }, []);

  return (
    <Sidebar
      platform={platform}
      ref={ref}
      notifications={notifications}
      offline={qNetwork.status === 'rejected'}
      updateAvailable={podmanDetails?.isOutdated || false}
      podmanInstalled={isPodmanInstalled}
      podmanStopped={!isPodmanRunning}
      sUserNodePackages={sUserNodePackages}
      selectedNodePackageId={sSelectedNodePackageId}
      onClickStartPodman={onClickStartPodman}
      onClickInstallPodman={onClickInstallPodman}
    />
  );
});
