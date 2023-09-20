import { useNavigate } from 'react-router-dom';
import { NotificationItemProps } from '../../Generics/redesign/NotificationItem/NotificationItem';
import { setModalState } from '../../state/modal';
import { useAppDispatch } from '../../state/hooks';
import { updateSelectedNodePackageId } from '../../state/node';
import { NodeId, UserNodePackages } from '../../../common/node';
import { Banner } from '../../Generics/redesign/Banner/Banner';
import { SidebarNodeItemWrapper } from '../SidebarNodeItemWrapper/SidebarNodeItemWrapper';
import { SidebarLinkItem } from '../../Generics/redesign/SidebarLinkItem/SidebarLinkItem';
import { SidebarTitleItem } from '../../Generics/redesign/SidebarTitleItem/SidebarTitleItem';
import { container, nodeList, itemList, titleItem } from './sidebar.css';
import { IconId } from '../../assets/images/icons';
// import { NodeIconId } from '../../assets/images/nodeIcons';

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
   * Is podman not running?
   */
  podmanStopped: boolean;
  podmanInstalled: boolean;
  sUserNodePackages?: UserNodePackages;
  selectedNodePackageId?: NodeId;
  notifications: NotificationItemProps[];
  onClickStartPodman: () => void;
  onClickInstallPodman: () => void;
}

const Sidebar = ({
  sUserNodePackages,
  updateAvailable,
  offline,
  podmanStopped,
  podmanInstalled,
  selectedNodePackageId,
  notifications,
  onClickStartPodman,
  onClickInstallPodman,
}: SidebarProps) => {
  const dispatch = useAppDispatch();

  const itemListData: { iconId: IconId; label: string; count?: number }[] = [
    {
      iconId: 'bell',
      label: 'Notifications',
      count: notifications?.length,
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

  const onClickBanner = () => {
    if (podmanInstalled) {
      onClickStartPodman();
    } else {
      onClickInstallPodman();
    }
  };

  const renderBanners = () => {
    // TODO: integrate this with code below
    if (podmanStopped || !podmanInstalled) {
      return <Banner podmanStopped onClick={onClickBanner} />;
    }
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
  const navigate = useNavigate();

  return (
    <div className={container}>
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
        {sUserNodePackages?.nodeIds.map((nodeId: NodeId) => {
          const node = sUserNodePackages.nodes[nodeId];
          return (
            <SidebarNodeItemWrapper
              // temp fix
              id={node.id}
              node={node}
              selected={selectedNodePackageId === node.id}
              onClick={() => {
                navigate('/main/nodePackage');
                dispatch(updateSelectedNodePackageId(node.id));
              }}
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
              onClick={() => {
                console.log('sidebar link item clicked: ', item.iconId);
                if (item.iconId === 'add') {
                  dispatch(
                    setModalState({
                      isModalOpen: true,
                      screen: { route: 'addNode', type: 'modal' },
                    }),
                  );
                } else if (item.iconId === 'preferences') {
                  dispatch(
                    setModalState({
                      isModalOpen: true,
                      screen: { route: 'preferences', type: 'modal' },
                    }),
                  );
                } else if (item.iconId === 'bell') {
                  navigate('/main/notification');
                } else if (item.iconId === 'health') {
                  navigate('/main/system');
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
