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
}

/**
 * Primary UI component for user interaction
 */
export const MetricTypes = ({
  statsType,
  statsValue,
  info,
}: MetricTypesProps) => {
  let iconComponent = null;
  let titleText = '';
  let labelText = '';

  const processStatus = () => {
    let statusColorStyle;
    let icon = null;
    switch (statsValue) {
      case SYNC_STATUS.UPDATING:
        statusColorStyle = updating;
        titleText = 'Waiting';
        labelText = 'Installing update...';
        icon = <Icon iconId="updating" />;
        break;
      case SYNC_STATUS.SYNCHRONIZED:
        statusColorStyle = green;
        titleText = 'Online';
        labelText = 'Synchronized';
        break;
      case SYNC_STATUS.BLOCKS_BEHIND:
      case SYNC_STATUS.LOW_PEER_COUNT:
        statusColorStyle = yellow;
        titleText = 'Online';
        labelText =
          statsValue === SYNC_STATUS.BLOCKS_BEHIND
            ? 'Blocks behind'
            : 'Low Peer Count';
        break;
      case SYNC_STATUS.NO_NETWORK:
        statusColorStyle = red;
        titleText = 'Offline';
        labelText = 'No Network';
        break;
      case SYNC_STATUS.CATCHING_UP:
      case SYNC_STATUS.INITIALIZING:
        statusColorStyle = sync;
        titleText = 'Syncing';
        labelText =
          statsValue === SYNC_STATUS.CATCHING_UP
            ? 'Catching up...'
            : 'In progress...';
        icon = <Icon iconId="syncing" />;
        break;
      case SYNC_STATUS.STOPPED:
        statusColorStyle = stopped;
        titleText = 'Stopped';
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
        titleText = `${statsValue}`;
        labelText = 'Last synced block';
        break;
      case 'currentSlot':
        iconId = 'slots';
        titleText = Number(statsValue).toLocaleString();
        labelText = 'Current slot';
        break;
      case 'peers':
        iconId = 'peers';
        titleText = `${statsValue}`;
        if (statsValue === undefined) {
          titleText = `${0}`;
        }
        labelText = 'Peers connected';
        break;
      case 'cpuLoad':
        iconId = 'cpu';
        titleText = `${statsValue}%`;
        labelText = 'CPU load';
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
        labelText = 'Disk usage';
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
