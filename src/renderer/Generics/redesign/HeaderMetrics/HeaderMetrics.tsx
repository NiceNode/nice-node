import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { MetricTypes } from '../MetricTypes/MetricTypes';
import { container } from './headerMetrics.css';
import VerticalLine from '../VerticalLine/VerticalLine';

export interface HeaderMetricsProps {
  /**
   * Content type
   */
  type: 'altruistic' | 'client' | 'validator';
  /**
   * Node status
   */
  status: string;
  /**
   * Current slot
   */
  slot?: number;
  /**
   * Current CPU Load
   */
  cpuLoad?: number;
  /**
   * How much disk space is this node using?
   */
  diskUsage: number;
  /**
   * Is this header being shown on multiple clients screen? // TODO: Find a better way to do this
   */
  multiple: boolean;
}

const metricTypeArray = {
  altruistic: ['slots', 'cpu', 'disks'],
  client: ['slots', 'peers', 'disks'],
  validator: ['stake', 'rewards', 'balance'],
};

/**
 * Primary UI component for user interaction
 */
export const HeaderMetrics = ({
  type,
  status,
  slot,
  cpuLoad,
  diskUsage,
  multiple,
}: HeaderMetricsProps) => {
  const assignedMetric = metricTypeArray[type];
  return (
    <div className={container}>
      <MetricTypes status={status} />
      <VerticalLine />
      <MetricTypes secondaryType={assignedMetric[0]} />
      <VerticalLine />
      <MetricTypes secondaryType={assignedMetric[1]} />
      <VerticalLine />
      <MetricTypes secondaryType={assignedMetric[2]} />
    </div>
  );
};
