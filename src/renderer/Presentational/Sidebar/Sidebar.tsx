import { components } from 'react-select';
import { Banner } from '../../Generics/redesign/Banner/Banner';
import {
  SidebarNodeItem,
  SidebarNodeStatus,
} from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { SidebarLinkItem } from '../../Generics/redesign/SidebarLinkItem/SidebarLinkItem';
import { SidebarTitleItem } from '../../Generics/redesign/SidebarTitleItem/SidebarTitleItem';
import {
  container,
  banner,
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
  /**
   * Nice Node update available?
   */
  updateAvailable: boolean;
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

const Sidebar = (props: SidebarProps) => {
  const renderBanners = () => {
    return Object.keys(props).map((key) => {
      // eslint-disable-next-line react/destructuring-assignment
      if (props[key as keyof SidebarProps]) {
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

  return (
    <div className={container}>
      {renderBanners()}
      <div className={nodeList}>
        <div className={titleItem}>
          <SidebarTitleItem title="Nodes" />
        </div>
        {nodeListData.map((item) => {
          return (
            <SidebarNodeItem
              iconId={item.iconId}
              title={item.title}
              info={item.info}
              status={item.status}
              key={item.title}
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
