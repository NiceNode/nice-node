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
  healthy,
  warning,
  error,
  sync,
} from './metricTypes.css';

export interface MetricTypesProps {
  /**
   * Primary metric types
   */
  primaryType: 'header' | 'breakdown1' | 'breakdown2';
  /**
   * Secondary metric types
   */
  secondaryType:
    | 'blocks'
    | 'stake'
    | 'rewards'
    | 'peers'
    | 'cpu'
    | 'balance'
    | 'disk';
  /**
   * Status //TODO: match this with current status enum implementation
   */
  status?: null | 'healthy' | 'warning' | 'error' | 'sync';
  /**
   * Title of the metric
   */
  title: string;
  /**
   * Label
   */
  label: string;
  /**
   * Info
   */
  info?: string;
}

/**
 * Primary UI component for user interaction
 */
export const MetricTypes = ({
  primaryType,
  secondaryType,
  status,
  title,
  label,
  info,
}: MetricTypesProps) => {
  let statusComponent = null;
  let titleText = '';
  let labelText = '';

  const processStatus = () => {
    let statusColorStyle;
    switch (true) {
      case status === 'healthy':
        statusColorStyle = healthy;
        titleText = 'Online';
        labelText = 'Synchronized';
        break;
      case status === 'warning':
        statusColorStyle = warning;
        titleText = 'Warning';
        labelText = 'Warning';
        break;
      case status === 'error':
        statusColorStyle = error;
        titleText = 'Error';
        labelText = 'Error';
        break;
      case status === 'sync':
        statusColorStyle = sync;
        titleText = 'Syncing';
        labelText = 'In Progress...';
        break;
      default:
        break;
    }
    statusComponent = (
      <div className={[statusStyle, statusColorStyle].join(' ')}>
        {status === 'sync' && <Icon iconId="sync" />}
      </div>
    );
  };

  const processSecondaryType = () => {
    switch (secondaryType) {
      case 'blocks':
        titleText = '4,456,158';
        labelText = 'Current slot';
        break;
      case 'peers':
        titleText = '16';
        labelText = 'Peers connected';
        break;
      case 'cpu':
        titleText = '83%';
        labelText = 'CPU load';
        break;
      case 'disk':
        titleText = '1.52 GB';
        labelText = 'Disk usage';
        break;
      default:
        break;
    }
  };

  if (status) {
    processStatus();
  } else if (secondaryType) {
    processSecondaryType();
  }
  return (
    <div className={container}>
      {status && <div className={iconContainer}>{statusComponent}</div>}
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
