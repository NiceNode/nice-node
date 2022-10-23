import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import { MetricTypes } from '../MetricTypes/MetricTypes';
import { container } from './headerMetrics.css';
import VerticalLine from '../VerticalLine/VerticalLine';

export interface HeaderMetricsProps {
  nodeOverview: {
    name: string;
    title: string;
    info: string;
    type: string;
    version?: string;
    update?: string;
    status: {
      syncStatus: string; // change this to enum to compare weights?
      updateAvailable: boolean; // look through both clients
      stopped: boolean;
    };
    stats: {
      peers?: number;
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
export const HeaderMetrics = ({ nodeOverview }: HeaderMetricsProps) => {
  const {
    type,
    status: { syncStatus },
    stats,
  } = nodeOverview;
  const assignedMetric = metricTypeArray[type];
  return (
    <div className={container}>
      {assignedMetric.map((metric, index) => {
        const statsValue = index === 0 ? syncStatus : stats[metric];
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
