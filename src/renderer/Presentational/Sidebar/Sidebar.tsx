import { NodeId, NodeStatus } from 'common/node';
import { useCallback, useEffect } from 'react';
import {
  selectSelectedNodeId,
  selectUserNodes,
  updateSelectedNodeId,
} from 'renderer/state/node';
import { useAppDispatch, useAppSelector } from 'renderer/state/hooks';
import { Banner } from '../../Generics/redesign/Banner/Banner';
import {
  SidebarNodeItem,
  SidebarNodeStatus,
} from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { SidebarLinkItem } from '../../Generics/redesign/SidebarLinkItem/SidebarLinkItem';
import { SidebarTitleItem } from '../../Generics/redesign/SidebarTitleItem/SidebarTitleItem';
import {
  container,
  networkBanner,
  nodeList,
  itemList,
  titleItem,
} from './sidebar.css';
import { IconId } from '../../assets/images/icons';
import { NodeIconId } from '../../assets/images/nodeIcons';

export interface SidebarProps {
  /**
   * Offline mode?
   */
  offline: boolean;
}

const nodeListData: {
  iconId: NodeIconId;
  title: string;
  info: string;
  status: SidebarNodeStatus;
}[] = [
  {
    iconId: 'ethereum',
    title: 'Ethereum',
    info: 'Mainnet',
    status: 'healthy',
  },
  {
    iconId: 'zkSync',
    title: 'zkSync',
    info: 'Rinkeby',
    status: 'sync',
  },
  {
    iconId: 'arbitrum',
    title: 'Arbitrum Nitro',
    info: 'Testnet',
    status: 'healthy',
  },
  {
    iconId: 'starknet',
    title: 'Starknet',
    info: 'Testnet',
    status: 'error',
  },
  {
    iconId: 'livepeer',
    title: 'Livepeer Orchestrator',
    info: 'Testnet',
    status: 'warning',
  },
];

const itemListData: { iconId: IconId; label: string; count?: number }[] = [
  {
    iconId: 'health',
    label: 'System Monitor',
  },
  {
    iconId: 'add',
    label: 'Add Node',
  },
  {
    iconId: 'preferences',
    label: 'Preferences',
  },
];

const NODE_SIDEBAR_STATUS_MAP: Record<NodeStatus, SidebarNodeStatus> = {
  created: 'stopped',
  initializing: 'sync',
  [NodeStatus.checkingForUpdates]: 'sync',
  downloading: 'sync',
  downloaded: 'sync',
  [NodeStatus.errorDownloading]: 'error',
  extracting: 'sync',
  [NodeStatus.readyToStart]: 'stopped',
  starting: 'sync',
  running: 'healthy',
  stopping: 'healthy',
  stopped: 'stopped',
  [NodeStatus.errorRunning]: 'error',
  [NodeStatus.errorStarting]: 'error',
  [NodeStatus.errorStopping]: 'error',
  unknown: 'error',
};

const Sidebar = ({ offline }: SidebarProps) => {
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

  // const nodeListObject = { nodeService: [], validator: [], singleClients: [] };
  // sUserNodes?.nodeIds.forEach((nodeId: NodeId) => {
  //   const node = sUserNodes.nodes[nodeId];
  //   // TODO: add validator logic here eventually
  //   if (
  //     node.spec.category === 'L1/ExecutionClient' ||
  //     node.spec.category === 'L1/ConsensusClient/BeaconNode'
  //   ) {
  //     nodeListObject.nodeService.push(node);
  //   } else {
  //     nodeListObject.singleClients.push(node);
  //   }
  // });

  const onClickLinkItem = useCallback((linkItemId) => {
    console.log('sidebar link item clicked: ', linkItemId);
    if (linkItemId === 'add') {
      // open add node dialog
    }
  }, []);

  return (
    <div className={container}>
      {offline && (
        <div className={networkBanner}>
          <Banner />
        </div>
      )}
      <div className={nodeList}>
        <div className={titleItem}>
          <SidebarTitleItem title="Nodes" />
        </div>
        {/* {nodeListObject.nodeService.length === 2 && (
          <SidebarNodeItem
            iconId="ethereum"
            title="Ethereum node"
            info="Mainnet"
            status={nodeListObject.nodeService[0].status} // TODO: get the worst status of both nodes
            key="ethereum"
            onClick={() => {
              dispatch(updateSelectedNodeId(nodeListObject.nodeService[1].id));
            }}
          />
        )} */}
        {sUserNodes?.nodeIds.map((nodeId: NodeId) => {
          const node = sUserNodes.nodes[nodeId];
          const { spec, status } = node;
          const sidebarStatus = NODE_SIDEBAR_STATUS_MAP[status];
          return (
            <SidebarNodeItem
              // temp fix
              key={node.id}
              iconId={spec.specId.replace('-beacon', '')}
              title={spec.displayName}
              info={spec.displayName}
              status={sidebarStatus}
              onClick={() => dispatch(updateSelectedNodeId(node.id))}
            />
          );
        })}
      </div>
      <div className={itemList}>
        {itemListData.map((item) => {
          return (
            <SidebarLinkItem
              key={item.label}
              iconId={item.iconId}
              label={item.label}
              count={item.count}
              onClick={() => onClickLinkItem(item.iconId)}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
