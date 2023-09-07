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

  const { t } = useTranslation();

  const processStatus = () => {
    let statusColorStyle;
    let icon = null;
    switch (statsValue) {
      case SYNC_STATUS.UPDATING:
        statusColorStyle = updating;
        titleText = t('Waiting');
        labelText = t('InstallingUpdate');
        icon = <Icon iconId="updating" />;
        break;
      case SYNC_STATUS.SYNCHRONIZED:
        statusColorStyle = green;
        titleText = t('Online');
        labelText = t('Synchronized');
        break;
      case SYNC_STATUS.BLOCKS_BEHIND:
      case SYNC_STATUS.LOW_PEER_COUNT:
        statusColorStyle = yellow;
        titleText = t('Online');
        labelText =
          statsValue === SYNC_STATUS.BLOCKS_BEHIND
            ? t('BlocksBehind')
            : t('LowPeerCount');
        break;
      case SYNC_STATUS.ERROR:
        statusColorStyle = red;
        titleText = t('Error');
        labelText = t('ErrorOcurred');
        break;
      case SYNC_STATUS.NO_NETWORK:
        statusColorStyle = red;
        titleText = t('Offline');
        labelText = t('NoNetwork');
        break;
      case SYNC_STATUS.CATCHING_UP:
      case SYNC_STATUS.INITIALIZING:
        statusColorStyle = sync;
        titleText = t('Syncing');
        labelText =
          statsValue === SYNC_STATUS.CATCHING_UP
            ? t('CatchingUp')
            : t('InProgress');
        icon = <Icon iconId="syncing" />;
        break;
      case SYNC_STATUS.STOPPED:
        statusColorStyle = stopped;
        titleText = t('Stopped');
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
        labelText = `${t('LastSynced')} ${
          rpcTranslation === 'eth-l1-beacon' ? t('Slot') : t('Block')
        }`;
        break;
      case 'peers':
        iconId = 'peers';
        titleText = `${statsValue}`;
        if (statsValue === undefined) {
          titleText = `${0}`;
        }
        labelText = t('PeersConnected');
        break;
      case 'cpuLoad':
        iconId = 'cpu';
        titleText = `${statsValue}%`;
        labelText = t('CPULoad');
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
        labelText = t('DiskUsage');
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
