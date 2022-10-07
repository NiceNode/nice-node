import { SidebarNodeItem } from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { SidebarLinkItem } from '../../Generics/redesign/SidebarLinkItem/SidebarLinkItem';
import { container, nodeList, itemList } from './sidebar.css';

export interface SidebarProps {
  title: string;
  description: string;
}

const nodeListData = [
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
];

const itemListData = [
  {
    iconId: 'bell',
    label: 'Notifications',
    count: 12,
  },
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

const Sidebar = ({ title, description }: SidebarProps) => {
  return (
    <div className={container}>
      <div className={nodeList}>
        {nodeListData.map((item) => {
          return (
            <SidebarNodeItem
              iconId={item.iconId}
              title={item.title}
              info={item.info}
              status={item.status}
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
