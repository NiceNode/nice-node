import { UserNodes } from 'common/node';
import React, { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  selectSelectedNodeId,
  selectUserNodes,
  updateSelectedNodeId,
} from '../../state/node';

export interface SidebarWrapperProps {
  children: ReactElement;
}

export const SidebarWrapper = ({
  children,
}: {
  children: (sUserNodes: UserNodes) => React.ReactNode;
}) => {
  const sSelectedNodeId = useAppSelector(selectSelectedNodeId);
  const sUserNodes = useAppSelector(selectUserNodes);
  const dispatch = useAppDispatch();

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

  if (!sUserNodes) {
    return null;
  }

  return <>{children(sUserNodes)}</>;
};
