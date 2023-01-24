import { useCallback, useState } from 'react';
import { getNotifications } from 'main/notifications';
import { useAppDispatch } from '../../state/hooks';
import { updateSelectedNodeId } from '../../state/node';
import { NodeId, NodeStatus, UserNodes } from '../../../common/node';
import { Banner } from '../../Generics/redesign/Banner/Banner';
import {
  SidebarNodeItem,
  SidebarNodeStatus,
} from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { SidebarLinkItem } from '../../Generics/redesign/SidebarLinkItem/SidebarLinkItem';
import { SidebarTitleItem } from '../../Generics/redesign/SidebarTitleItem/SidebarTitleItem';
import { container, nodeList, itemList, titleItem } from './sidebar.css';
import { IconId } from '../../assets/images/icons';
// import { NodeIconId } from '../../assets/images/nodeIcons';
import { Modal } from '../../Generics/redesign/Modal/Modal';
import AddNodeStepper from '../AddNodeStepper/AddNodeStepper';
import PreferencesWrapper from '../PreferencesModal/PreferencesWrapper';
import { DockerStoppedBanner } from '../DockerInstallation/StartDockerBanner';

export interface SidebarProps {
  /**
   * Offline mode?
   */
  offline: boolean;
  /**
   * Nice Node update available?
   */
  updateAvailable: boolean;
  /**
   * Is docker not running?
   */
  dockerStopped: boolean;
  sUserNodes?: UserNodes;
  selectedNodeId?: NodeId;
}

const itemListData: { iconId: IconId; label: string; count?: number }[] = [
  {
    iconId: 'bell',
    label: 'Notifications',
    count: getNotifications().length, // this needs to be updated based on changes in global state
  },
  {
    iconId: 'add',
    label: 'Add Node',
  },
  {
    iconId: 'preferences',
    label: 'Preferences',
  },
  {
    iconId: 'health',
    label: 'System Monitor',
  },
];

const NODE_SIDEBAR_STATUS_MAP: Record<NodeStatus, SidebarNodeStatus> = {
  created: 'stopped',
  initializing: 'updating',
  [NodeStatus.checkingForUpdates]: 'updating',
  downloading: 'updating',
  downloaded: 'stopped',
  [NodeStatus.errorDownloading]: 'error',
  extracting: 'updating',
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

const Sidebar = ({
  sUserNodes,
  updateAvailable,
  offline,
  dockerStopped,
  selectedNodeId,
}: SidebarProps) => {
  const dispatch = useAppDispatch();
  const [sIsModalOpenAddNode, setIsModalOpenAddNode] = useState<boolean>();
  const [sIsModalOpenSettings, setIsModalOpenSettings] =
    useState<boolean>(false);

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

  const renderBanners = () => {
    const bannerProps = {
      updateAvailable,
      offline,
    };
    return Object.keys(bannerProps).map((key) => {
      // eslint-disable-next-line react/destructuring-assignment
      if (bannerProps[key as keyof typeof bannerProps]) {
        // ^ not sure if this is correct
        return (
          <Banner
            offline={false}
            updateAvailable={false}
            {...{ [key]: true }}
          />
        );
      }
      return null;
    });
  };

  const onClickLinkItem = useCallback((linkItemId: string) => {
    console.log('sidebar link item clicked: ', linkItemId);
    if (linkItemId === 'add') {
      // open add node dialog
      setIsModalOpenAddNode(true);
    } else if (linkItemId === 'preferences') {
      setIsModalOpenSettings(true);
    }
  }, []);

  return (
    <div className={container}>
      {dockerStopped && <DockerStoppedBanner />}
      {renderBanners()}
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
          console.log(node, 'sidebarStatus', sidebarStatus);
          return (
            <SidebarNodeItem
              // temp fix
              key={node.id}
              iconId={spec.specId.replace('-beacon', '')}
              title={spec.displayName}
              info={spec.displayName}
              status={sidebarStatus}
              selected={selectedNodeId === node.id}
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
      {/* <NotificationsWrapper /> */}
      <Modal
        title=""
        isOpen={sIsModalOpenAddNode}
        onClickCloseButton={() => setIsModalOpenAddNode(false)}
        isFullScreen
      >
        <AddNodeStepper
          onChange={(newValue: 'done' | 'cancel') => {
            console.log(newValue);
            if (newValue === 'done' || newValue === 'cancel') {
              setIsModalOpenAddNode(false);
            }
          }}
        />
      </Modal>
      <PreferencesWrapper
        isOpen={sIsModalOpenSettings}
        onClose={() => setIsModalOpenSettings(false)}
      />
    </div>
  );
};
export default Sidebar;
