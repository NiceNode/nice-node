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
  stopped,
} from './metricTypes.css';

export interface MetricTypesProps {
  /**
   * Stats types
   */
  statsType?: 'status' | 'slots' | 'blocks' | 'peers' | 'cpuLoad' | 'diskUsage';
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
      case SYNC_STATUS.SYNCHRONIZED:
        statusColorStyle = green;
        titleText = 'Online';
        labelText = 'Synchronized';
        break;
      case SYNC_STATUS.LOW_PEER_COUNT:
        statusColorStyle = yellow;
        titleText = 'Online';
        labelText = 'Low Peer Count';
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
    let iconId = statsType;
    console.log(statsValue);
    switch (statsType) {
      case 'blocks':
        iconId = 'slots';
        titleText = `${statsValue}`;
        labelText = 'Last synced block';
        break;
      case 'slots':
        titleText = `${statsValue}`;
        labelText = 'Current slot';
        break;
      case 'peers':
        titleText = '16';
        labelText = 'Peers connected';
        break;
      case 'cpuLoad':
        iconId = 'cpu';
        titleText = `${statsValue}%`;
        labelText = 'CPU load';
        break;
      case 'diskUsage':
        if (statsValue >= 1000000) {
          titleText = `${statsValue / 1000000} TB`;
        } else if (statsValue <= 999999 && statsValue >= 1000) {
          titleText = `${statsValue / 1000} GB`;
        } else {
          titleText = `${statsValue} MB`;
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
