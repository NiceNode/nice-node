import React from 'react';
import {
  wrapper,
  container,
  section,
  other,
  client,
  free,
  legendContainer,
  legend,
  otherColorBox,
  labelContainer,
  label,
  size,
  colorBox,
  freeColorBox,
} from './diskCapacityBarChart.css';

export interface DiskCapacityBarChartProps {
  otherSpace: number;
  clientSpace: number;
  totalSpace: number;
  clientType: string;
}

const DiskCapacityBarChart = ({
  otherSpace,
  clientSpace,
  totalSpace,
  clientType,
}: DiskCapacityBarChartProps) => {
  const clientColorMap: { [client: string]: string } = {
    Nimbus: 'red',
    Besu: 'green',
    Other: 'blue', // default color for other clients
  };

  const freeSpace = totalSpace - (otherSpace + clientSpace);
  const otherPercentage = (otherSpace / totalSpace) * 100;
  const clientPercentage = (clientSpace / totalSpace) * 100;
  const freePercentage = (freeSpace / totalSpace) * 100;

  return (
    <div className={wrapper}>
      <div className={container}>
        <div
          className={`${section} ${other}`}
          style={{ width: `${otherPercentage}%` }}
        />
        <div
          className={`${section} ${client}`}
          style={{
            backgroundColor: clientColorMap[clientType],
            width: `${clientPercentage}%`,
          }}
        />
        <div
          className={`${section} ${free}`}
          style={{ width: `${freePercentage}%` }}
        />
      </div>

      <div className={legendContainer}>
        <div className={legend}>
          <div className={otherColorBox} />
          <div className={labelContainer}>
            <div className={label}>Other</div>
            <div className={size}>{otherSpace} GB</div>
          </div>
        </div>

        <div className={legend}>
          <div
            className={colorBox}
            style={{ backgroundColor: clientColorMap[clientType] }}
          />
          <div className={labelContainer}>
            <div className={label}>{clientType} Client</div>
            <div className={size}>{clientSpace} GB</div>
          </div>
        </div>

        <div className={legend}>
          <div className={freeColorBox} />
          <div className={labelContainer}>
            <div className={label}>Free Space</div>
            <div className={size}>{freeSpace} GB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiskCapacityBarChart;
