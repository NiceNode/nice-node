import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { MetricTypes } from '../MetricTypes/MetricTypes';
import { container } from './headerMetrics.css';
import VerticalLine from '../VerticalLine/VerticalLine';

export interface HeaderMetricsProps {
  /**
   * Node status
   */
  status: string;
  /**
   * Current slot
   */
  slot: number;
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

/**
 * Primary UI component for user interaction
 */
export const HeaderMetrics = ({
  status,
  slot,
  cpuLoad,
  diskUsage,
  multiple,
}: HeaderMetricsProps) => {
  return (
    <div className={container}>
      <MetricTypes status="sync" />
      <VerticalLine />
      <MetricTypes secondaryType="slots" />
      <VerticalLine />
      <MetricTypes secondaryType="cpu" />
      <VerticalLine />
      <MetricTypes secondaryType="disks" />
    </div>
  );
};
