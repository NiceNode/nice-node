import { NodeId } from 'common/node';
import { useEffect } from 'react';
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

  const nodeListObject = { nodeService: [], validator: [], singleClients: [] };
  sUserNodes?.nodeIds.forEach((nodeId: NodeId) => {
    const node = sUserNodes.nodes[nodeId];
    // TODO: add validator logic here eventually
    if (
      node.spec.category === 'L1/ExecutionClient' ||
      node.spec.category === 'L1/ConsensusClient/BeaconNode'
    ) {
      nodeListObject.nodeService.push(node);
    } else {
      nodeListObject.singleClients.push(node);
    }
  });

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
        {nodeListObject.nodeService.length === 2 && (
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
        )}
        {nodeListObject.singleClients.map((nodeId: NodeId) => {
          const item = sUserNodes.nodes[nodeId];
          const { spec, status } = item;
          return (
            <SidebarNodeItem
              iconId={spec.specId}
              title={spec.displayName}
              info={spec.displayName}
              status={status}
              key={spec.displayName}
            />
          );
        })}
      </div>
      <div className={itemList}>
        {itemListData.map((item) => {
          return (
            <SidebarLinkItem
              iconId={item.iconId}
              label={item.label}
              count={item.count}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
