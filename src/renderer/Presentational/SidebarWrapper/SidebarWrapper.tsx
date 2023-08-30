import { ReactElement, useEffect, useCallback } from 'react';
import { NotificationItemProps } from '../../Generics/redesign/NotificationItem/NotificationItem';
import electron from '../../electronGlobal';
import { useGetNotificationsQuery } from '../../state/notificationsService';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  selectSelectedNodePackageId,
  selectUserNodePackages,
  updateSelectedNodePackageId,
  selectSelectedNodeId,
  selectUserNodes,
  updateSelectedNodeId,
} from '../../state/node';
import {
  useGetIsPodmanRunningQuery,
  useGetIsPodmanInstalledQuery,
} from '../../state/settingsService';
import Sidebar from '../Sidebar/Sidebar';

export interface SidebarWrapperProps {
  children: ReactElement;
}

export const SidebarWrapper = () => {
  const sSelectedNodePackageId = useAppSelector(selectSelectedNodePackageId);
  const sUserNodePackages = useAppSelector(selectUserNodePackages);
  // const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  // const sUserNodes = useAppSelector(selectUserNodes);
  const dispatch = useAppDispatch();
  // todo: implement a back-off polling strategy which can be "reset"
  const qIsPodmanInstalled = useGetIsPodmanInstalledQuery();
  const isPodmanInstalled = qIsPodmanInstalled?.data;
  const qIsPodmanRunning = useGetIsPodmanRunningQuery(null, {
    pollingInterval: 15000,
  });
  // default to docker is running while data is being fetched, so
  //  the user isn't falsely warned
  let isPodmanRunning = true;
  if (qIsPodmanRunning && !qIsPodmanRunning.fetching) {
    isPodmanRunning = qIsPodmanRunning.data;
  }

  const onClickInstallPodman = async () => {
    console.log('install podman');
    const installResult = await electron.installPodman();
    qIsPodmanInstalled.refetch();
    qIsPodmanRunning.refetch();
    if (installResult && !installResult.error) {
      console.log('podman installed, do something');
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listenForNotifications = useCallback(async () => {
    electron.ipcRenderer.on('notifications', onNotificationChange);
    return () =>
      electron.ipcRenderer.removeListener(
        'notifications',
        onNotificationChange,
      );
  }, [onNotificationChange]);

  useEffect(() => {
    listenForNotifications();
  }, [listenForNotifications]);

  // Default selected node to be the first node
  useEffect(() => {
    if (
      !sSelectedNodePackageId &&
      sUserNodePackages &&
      Array.isArray(sUserNodePackages?.nodeIds) &&
      sUserNodePackages.nodeIds.length > 0
    ) {
      dispatch(updateSelectedNodeId(sUserNodePackages.nodeIds[0]));
    }
  }, [sSelectedNodePackageId, sUserNodePackages, dispatch]);

  return (
    <Sidebar
      notifications={notifications}
      offline={false}
      updateAvailable={false}
      podmanInstalled={isPodmanInstalled}
      podmanStopped={!isPodmanRunning}
      sUserNodePackages={sUserNodePackages}
      selectedNodePackageId={sSelectedNodePackageId}
      onClickStartPodman={onClickStartPodman}
      onClickInstallPodman={onClickInstallPodman}
    />
  );
};
