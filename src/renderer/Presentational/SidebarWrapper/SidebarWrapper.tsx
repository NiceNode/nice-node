import { ReactElement, useEffect, useCallback } from 'react';
import electron from 'renderer/electronGlobal';
import { useGetNotificationsQuery } from '../../state/notificationsService';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  selectSelectedNodeId,
  selectUserNodes,
  updateSelectedNodeId,
} from '../../state/node';
import { useGetIsDockerRunningQuery } from '../../state/settingsService';
import Sidebar from '../Sidebar/Sidebar';

export interface SidebarWrapperProps {
  children: ReactElement;
}

export const SidebarWrapper = () => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const sUserNodes = useAppSelector(selectUserNodes);
  const dispatch = useAppDispatch();
  // todo: implement a back-off polling strategy which can be "reset"
  const qIsDockerRunning = useGetIsDockerRunningQuery(null, {
    pollingInterval: 15000,
  });
  // default to docker is running while data is being fetched, so
  //  the user isn't falsely warned
  let isDockerRunning = true;
  if (qIsDockerRunning && !qIsDockerRunning.fetching) {
    isDockerRunning = qIsDockerRunning.data;
  }

  const qNotifications = useGetNotificationsQuery();

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
        onNotificationChange
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
      notifications={qNotifications?.data}
      offline={false}
      updateAvailable={false}
      dockerStopped={!isDockerRunning}
      sUserNodes={sUserNodes}
      selectedNodeId={sSelectedNodeId}
    />
  );
};
