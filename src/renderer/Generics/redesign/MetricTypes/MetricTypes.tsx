import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import Button from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { NodeIcon } from '../NodeIcon/NodeIcon';
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
} from './metricTypes.css';

export interface MetricTypesProps {
  /**
   * Stats types
   */
  statsType?: 'status' | 'slots' | 'peers' | 'cpuLoad' | 'diskUsage';
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

  // TODO: abstract this out if it gets complex

  const processStatus = () => {
    let statusColorStyle;
    switch (statsValue) {
      case 'healthy':
        statusColorStyle = green;
        titleText = 'Online';
        labelText = 'Synchronized';
        break;
      case 'warning':
        statusColorStyle = yellow;
        titleText = 'Warning';
        labelText = 'Warning';
        break;
      case 'error':
        statusColorStyle = red;
        titleText = 'Error';
        labelText = 'Error';
        break;
      case 'sync':
        statusColorStyle = sync;
        titleText = 'Syncing';
        labelText = 'In Progress...';
        break;
      default:
        break;
    }
    iconComponent = (
      <div className={[statusStyle, statusColorStyle].join(' ')}>
        {statsValue === 'sync' && <Icon iconId="syncing" />}
      </div>
    );
  };

  const processStatsType = () => {
    let iconId = statsType;
    switch (statsType) {
      case 'slots':
        titleText = '4,456,158';
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
