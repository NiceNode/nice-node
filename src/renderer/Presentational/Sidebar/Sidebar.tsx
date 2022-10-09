import { SidebarNodeItem } from '../../Generics/redesign/SidebarNodeItem/SidebarNodeItem';
import { SidebarLinkItem } from '../../Generics/redesign/SidebarLinkItem/SidebarLinkItem';
import { SidebarTitleItem } from '../../Generics/redesign/SidebarTitleItem/SidebarTitleItem';
import { container, nodeList, itemList, titleItem } from './sidebar.css';

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
  {
    iconId: 'livepeer',
    title: 'Livepeer Orchestrator',
    info: 'Testnet',
    status: 'warning',
  },
];

const itemListData = [
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
