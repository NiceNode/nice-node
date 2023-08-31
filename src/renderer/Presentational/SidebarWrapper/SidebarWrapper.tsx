import { ReactElement, useEffect, useCallback } from 'react';
import { NotificationItemProps } from '../../Generics/redesign/NotificationItem/NotificationItem';
import electron from '../../electronGlobal';
import { useGetNotificationsQuery } from '../../state/notificationsService';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
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
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const sUserNodes = useAppSelector(selectUserNodes);
  const dispatch = useAppDispatch();
  // todo: implement a back-off polling strategy which can be "reset"
  const qIsPodmanInstalled = useGetIsPodmanInstalledQuery();
  const isPodmanInstalled = qIsPodmanInstalled?.data;
  const qIsPodmanRunning = useGetIsPodmanRunningQuery();
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
      !sSelectedNodeId &&
      sUserNodes &&
      Array.isArray(sUserNodes?.nodeIds) &&
      sUserNodes.nodeIds.length > 0
    ) {
      dispatch(updateSelectedNodeId(sUserNodes.nodeIds[0]));
    }
  }, [sSelectedNodeId, sUserNodes, dispatch]);

  return (
    <Sidebar
      notifications={notifications}
      offline={false}
      updateAvailable={false}
      podmanInstalled={isPodmanInstalled}
      podmanStopped={!isPodmanRunning}
      sUserNodes={sUserNodes}
      selectedNodeId={sSelectedNodeId}
      onClickStartPodman={onClickStartPodman}
      onClickInstallPodman={onClickInstallPodman}
    />
  );
};
