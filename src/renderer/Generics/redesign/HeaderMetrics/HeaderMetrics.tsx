import React from 'react';
import { MetricStats, MetricTypes } from '../MetricTypes/MetricTypes';
import { container } from './headerMetrics.css';
import VerticalLine from '../VerticalLine/VerticalLine';
import { getSyncStatus } from '../utils';
import { NodeOverviewProps } from '../consts';

export const HeaderMetrics = (props: NodeOverviewProps) => {
  const { screenType, status, stats, rpcTranslation } = props;
  const metricTypeArray: {
    nodePackage: MetricStats[];
    client: MetricStats[];
    validator: MetricStats[];
  } = {
    nodePackage: ['status', 'memoryUsagePercent', 'cpuLoad', 'diskUsageGBs'],
    client: ['status', 'currentBlock', 'peers', 'diskUsageGBs'],
    validator: ['status', 'stake', 'rewards', 'balance'],
  };
  const assignedMetric = metricTypeArray[screenType];
  return (
    <div className={container}>
      {assignedMetric?.map((metric, index) => {
        let statsValue;
        if (metric === 'status') {
          statsValue = getSyncStatus(status);
        } else {
          statsValue = stats[metric];
        }
        // const statsValue = index === 0 ? getSyncStatus(status) : stats[metric];
        return (
          <React.Fragment key={metric}>
            <MetricTypes
              statsValue={statsValue}
              statsType={assignedMetric[index]}
              rpcTranslation={rpcTranslation}
            />
            {index !== 3 && <VerticalLine />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
