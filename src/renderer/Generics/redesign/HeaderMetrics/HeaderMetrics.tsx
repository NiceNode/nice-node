import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { MetricTypes } from '../MetricTypes/MetricTypes';
import { container } from './headerMetrics.css';
import VerticalLine from '../VerticalLine/VerticalLine';

export interface HeaderMetricsProps {
  node: {
    name: string;
    title: string;
    info: string;
    type: string;
    version?: string;
    update?: string;
    status: string;
    stats: {
      block?: string;
      cpuLoad?: number;
      diskUsage?: number;
    };
  };
}

const metricTypeArray = {
  altruistic: ['status', 'slots', 'cpuLoad', 'diskUsage'],
  client: ['status', 'slots', 'peers', 'diskUsage'],
  validator: ['status', 'stake', 'rewards', 'balance'],
};

/**
 * Primary UI component for user interaction
 */
export const HeaderMetrics = ({ node }: HeaderMetricsProps) => {
  const { type, status, stats } = node;
  const assignedMetric = metricTypeArray[type];
  return (
    <div className={container}>
      {assignedMetric.map((metric, index) => {
        const statsValue = index === 0 ? status : stats[metric];
        return (
          <>
            <MetricTypes
              statsValue={statsValue}
              statsType={assignedMetric[index]}
            />
            {index !== 3 && <VerticalLine />}
          </>
        );
      })}
    </div>
  );
};
