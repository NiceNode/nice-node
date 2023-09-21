import { useTranslation } from 'react-i18next';
import { NiceNodeRpcTranslation } from 'common/rpcTranslation';
import { IconId } from '../../../assets/images/icons';
import { SYNC_STATUS } from '../consts';
import { Icon } from '../Icon/Icon';
import {
  statusStyle,
  container,
  iconContainer,
  textContainer,
  titleContainer,
  titleStyle,
  labelStyle,
  infoStyle,
  green,
  yellow,
  red,
  sync,
  updating,
  stopped,
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
  /**
   * Stats types
   */
  statsType?: MetricStats;
  /**
   * Status //TODO: match this with current status enum implementation
   */
  statsValue?: string | number;
  /**
   * Info
   */
  info?: string;
  rpcTranslation?: NiceNodeRpcTranslation;
}

/**
 * Primary UI component for user interaction
 */
export const MetricTypes = ({
  statsType,
  statsValue,
  info,
  rpcTranslation,
}: MetricTypesProps) => {
  let iconComponent = null;
  let titleText = '';
  let labelText = '';

  const { t: g } = useTranslation('genericComponents');

  const processStatus = () => {
    let statusColorStyle;
    let icon = null;
    switch (statsValue) {
      case SYNC_STATUS.UPDATING:
        statusColorStyle = updating;
        titleText = g('Waiting');
        labelText = g('InstallingUpdate');
        icon = <Icon iconId="updating" />;
        break;
      case SYNC_STATUS.SYNCHRONIZED:
        statusColorStyle = green;
        titleText = g('Online');
        labelText = g('Synchronized');
        break;
      case SYNC_STATUS.BLOCKS_BEHIND:
      case SYNC_STATUS.LOW_PEER_COUNT:
        statusColorStyle = yellow;
        titleText = g('Online');
        labelText =
          statsValue === SYNC_STATUS.BLOCKS_BEHIND
            ? g('BlocksBehind')
            : g('LowPeerCount');
        break;
      case SYNC_STATUS.ERROR:
        statusColorStyle = red;
        titleText = g('Error');
        labelText = g('ErrorOccurred');
        break;
      case SYNC_STATUS.NO_NETWORK:
        statusColorStyle = red;
        titleText = g('Offline');
        labelText = g('NoNetwork');
        break;
      case SYNC_STATUS.CATCHING_UP:
      case SYNC_STATUS.INITIALIZING:
        statusColorStyle = sync;
        titleText = g('Syncing');
        labelText =
          statsValue === SYNC_STATUS.CATCHING_UP
            ? g('CatchingUp')
            : g('InProgress');
        icon = <Icon iconId="syncing" />;
        break;
      case SYNC_STATUS.STOPPED:
        statusColorStyle = stopped;
        titleText = g('Stopped');
        icon = <Icon iconId="stop" />;
        break;
      default:
        break;
    }
    iconComponent = (
      <div className={[statusStyle, statusColorStyle].join(' ')}>{icon}</div>
    );
  };

  const processStatsType = () => {
    let iconId: IconId = 'blank';
    switch (statsType) {
      case 'currentBlock':
        iconId = 'slots';
        titleText = `${(statsValue || 0).toLocaleString()}`;
        labelText = `${g('LastSynced')} ${
          rpcTranslation === 'eth-l1-beacon' ? g('Slot') : g('Block')
        }`;
        break;
      case 'peers':
        iconId = 'peers';
        titleText = `${statsValue}`;
        if (statsValue === undefined) {
          titleText = `${0}`;
        }
        labelText = g('PeersConnected');
        break;
      case 'memoryUsagePercent':
        if (typeof statsValue === 'number') {
          titleText = `${statsValue.toFixed(2)}%`;
        } else {
          titleText = `${statsValue}%`;
        }
        iconId = 'lightning';
        labelText = 'Memory usage';
        break;
      case 'cpuLoad':
        iconId = 'cpu';
        if (typeof statsValue === 'number') {
          titleText = `${statsValue.toFixed(2)}%`;
        } else {
          titleText = `${statsValue}%`;
        }
        labelText = g('CPULoad');
        break;
      case 'diskUsageGBs':
        // if (typeof statsValue === 'number' && statsValue >= 1000000) {
        //   titleText = `${statsValue / 1000000} TB`;
        // } else if (
        //   typeof statsValue === 'number' &&
        //   statsValue <= 999999 &&
        //   statsValue >= 1000
        // ) {
        //   titleText = `${statsValue / 1000} GB`;
        // } else {
        //   titleText = `${statsValue} MB`;
        // }
        if (typeof statsValue === 'number') {
          titleText = `${statsValue.toFixed(2)} GB`;
        } else {
          titleText = `${statsValue} GB`;
        }
        iconId = 'disks';
        labelText = g('DiskUsage');
        break;
      default:
        break;
    }
    iconComponent = <Icon iconId={iconId} />;
  };

  if (statsType === 'status') {
    processStatus();
  } else if (statsType) {
    processStatsType();
  }
  return (
    <div className={container}>
      <div className={iconContainer}>{iconComponent}</div>
      <div className={textContainer}>
        <div className={titleContainer}>
          <div className={titleStyle}>{titleText}</div>
          <div className={labelStyle}>{labelText}</div>
        </div>
        <div className={infoStyle}>{info}</div>
      </div>
    </div>
  );
};
