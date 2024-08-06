import { useTranslation } from 'react-i18next';
import type { NiceNodeRpcTranslation } from '../../../../common/rpcTranslation';
import type { IconId } from '../../../assets/images/icons';
import { Icon } from '../Icon/Icon';
import { SYNC_STATUS } from '../consts';
import {
  container,
  green,
  iconContainer,
  infoStyle,
  labelStyle,
  red,
  statusStyle,
  stopped,
  sync,
  textContainer,
  titleContainer,
  titleStyle,
  updating,
  yellow,
} from './metricTypes.css';

export type MetricStats =
  | 'status'
  | 'currentSlot'
  | 'currentBlock'
  | 'peers'
  | 'cpuLoad'
  | 'diskUsageGBs'
  | 'memoryUsagePercent'
  | 'balance'
  | 'stake'
  | 'rewards';

export interface MetricTypesProps {
  statsType?: MetricStats;
  statsValue?: string | number;
  info?: string;
  rpcTranslation?: NiceNodeRpcTranslation;
}

const getStatusDetails = (statusValue: string, t: any) => {
  // console.log('statusValue', statusValue);
  switch (statusValue) {
    case SYNC_STATUS.UPDATING:
      return {
        color: updating,
        title: t('Waiting'),
        label: t('InstallingUpdate'),
        iconId: 'updating',
      };
    case SYNC_STATUS.SYNCHRONIZED:
      return { color: green, title: t('Online'), label: t('Synchronized') };
    case SYNC_STATUS.BLOCKS_BEHIND:
      return { color: yellow, title: t('Online'), label: t('BlocksBehind') };
    case SYNC_STATUS.LOW_PEER_COUNT:
      return { color: yellow, title: t('Online'), label: t('LowPeerCount') };
    case SYNC_STATUS.ERROR:
      return { color: red, title: t('Error'), label: t('ErrorOccurred') };
    case SYNC_STATUS.NO_CONNECTION:
      return { color: red, title: t('Offline'), label: t('NoNetwork') };
    case SYNC_STATUS.STARTING:
      return {
        color: sync,
        title: t('Starting'),
        label: t('InProgress'),
        iconId: 'syncing',
      };
    case SYNC_STATUS.CATCHING_UP:
      return {
        color: sync,
        title: t('Syncing'),
        label: t('CatchingUp'),
        iconId: 'syncing',
      };
    case SYNC_STATUS.INITIALIZING:
      return {
        color: sync,
        title: t('Syncing'),
        label: t('InProgress'),
        iconId: 'syncing',
      };
    case SYNC_STATUS.STOPPING:
      return { color: stopped, title: t('Stopping'), iconId: 'syncing' };
    case SYNC_STATUS.STOPPED:
      return { color: stopped, title: t('Stopped'), iconId: 'stop' };
    case SYNC_STATUS.ONLINE:
      return { color: green, title: t('Online'), label: t('Running') };
    default:
      return {};
  }
};

const getStatsDetails = (
  statsType: MetricStats,
  statsValue: string | number,
  t: any,
  rpcTranslation?: NiceNodeRpcTranslation,
) => {
  switch (statsType) {
    case 'currentBlock':
      return {
        iconId: 'slots',
        title: `${(statsValue || 0).toLocaleString()}`,
        label:
          rpcTranslation === 'farcaster-l1'
            ? `Farcaster ${t('Messages')}`
            : `${t('LastSynced')} ${
                rpcTranslation === 'eth-l1-beacon' ||
                rpcTranslation === 'eth-l2-consensus'
                  ? t('Slot')
                  : t('Block')
              }`,
      };
    case 'peers':
      return {
        iconId: 'peers',
        title:
          statsValue === undefined
            ? `${0}`
            : typeof statsValue === 'string'
              ? `${(Number.parseInt(statsValue, 10) || 0).toLocaleString()}`
              : `${statsValue.toLocaleString()}`,
        label:
          rpcTranslation === 'farcaster-l1'
            ? `FIDs ${t('Registered')}`
            : t('PeersConnected'),
      };
    case 'memoryUsagePercent':
      return {
        iconId: 'lightning',
        title: `${Number(statsValue).toFixed(2)}%`,
        label: t('MemoryUsage'),
      };
    case 'cpuLoad':
      return {
        iconId: 'cpu',
        title: `${Number(statsValue).toFixed(2)}%`,
        label: t('CPULoad'),
      };
    case 'diskUsageGBs':
      return {
        iconId: 'disks',
        title: `${Number(statsValue).toFixed(2)} GB`,
        label: t('DiskUsage'),
      };
    default:
      return {};
  }
};

export const MetricTypes = ({
  statsType,
  statsValue,
  info,
  rpcTranslation,
}: MetricTypesProps) => {
  const { t: g } = useTranslation('genericComponents');

  let details = {};
  if (statsType === 'status') {
    details = getStatusDetails(statsValue as string, g);
  } else if (statsType) {
    details = getStatsDetails(
      statsType,
      statsValue as string | number,
      g,
      rpcTranslation,
    );
  }

  const { color, title, label, iconId } = details as any;

  return (
    <div className={container}>
      <div className={iconContainer}>
        {statsType === 'status' && (
          <div className={[statusStyle, color].join(' ')}>
            <Icon iconId={iconId} />
          </div>
        )}
        {statsType !== 'status' && <Icon iconId={iconId} />}
      </div>
      <div className={textContainer}>
        <div className={titleContainer}>
          <div id={`${statsType}Value`} className={titleStyle}>
            {title}
          </div>
          <div className={labelStyle}>{label}</div>
        </div>
        <div className={infoStyle}>{info}</div>
      </div>
    </div>
  );
};
