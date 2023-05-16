import React from 'react';
import { NodeBackgroundId } from 'renderer/assets/images/nodeBackgrounds';
import {
  wrapper,
  container,
  section,
  other,
  client,
  free,
  legendContainer,
  legend,
  labelContainer,
  label,
  size,
  colorBox,
} from './diskCapacityBarChart.css';
import { common } from '../theme.css';

export interface DiskCapacityBarChartProps {
  otherSpace: number;
  clientSpace: number;
  totalSpace: number;
  name: NodeBackgroundId;
}

const DiskCapacityBarChart = ({
  otherSpace,
  clientSpace,
  totalSpace,
  name,
}: DiskCapacityBarChartProps) => {
  const freeSpace = totalSpace - (otherSpace + clientSpace);
  const otherPercentage = (otherSpace / totalSpace) * 100;
  const clientPercentage = (clientSpace / totalSpace) * 100;
  const freePercentage = (freeSpace / totalSpace) * 100;
  const capitalize = (s: string) =>
    (s && s[0].toUpperCase() + s.slice(1)) || '';

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
            backgroundColor: common.color[name],
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
          <div className={[colorBox, 'other'].join(' ')} />
          <div className={labelContainer}>
            <div className={label}>Other</div>
            <div className={size}>{otherSpace} GB</div>
          </div>
        </div>

        <div className={legend}>
          <div
            className={colorBox}
            style={{ backgroundColor: common.color[name] }}
          />
          <div className={labelContainer}>
            <div className={label}>{capitalize(name)} Client</div>
            <div className={size}>{clientSpace} GB</div>
          </div>
        </div>

        <div className={legend}>
          <div className={[colorBox, 'free'].join(' ')} />
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
