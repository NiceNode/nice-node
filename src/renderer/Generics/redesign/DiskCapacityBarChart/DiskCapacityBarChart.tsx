import { useTranslation } from 'react-i18next';
import { NodeBackgroundId } from '../../../assets/images/nodeBackgrounds';
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

export interface DiskCapacityBarChartProps {
  freeSpace: number;
  clientSpace: number;
  totalSpace: number;
  name: NodeBackgroundId;
}

const DiskCapacityBarChart = ({
  freeSpace,
  clientSpace,
  totalSpace,
  name,
}: DiskCapacityBarChartProps) => {
  const otherSpace = totalSpace - freeSpace;
  const otherPercentage = (otherSpace / totalSpace) * 100;
  const clientPercentage = (clientSpace / totalSpace) * 100;

  const freePercentage = (freeSpace / totalSpace) * 100;
  const capitalize = (s: string) =>
    (s && s[0].toUpperCase() + s.slice(1)) || '';
  const { t: g } = useTranslation('genericComponents');

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
            backgroundColor: 'rgba(76, 128, 246, 1)',
            // backgroundColor: common.color[name],
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
            <div className={label}>{g('Other')}</div>
            <div className={size}>{otherSpace.toFixed(2)} GB</div>
          </div>
        </div>

        <div className={legend}>
          <div
            className={colorBox}
            // style={{ backgroundColor: common.color[name] }}
            style={{ backgroundColor: 'rgba(76, 128, 246, 1)' }}
          />
          <div className={labelContainer}>
            <div className={label}>
              {capitalize(name)} {g('Client')}
            </div>
            <div className={size}>{clientSpace.toFixed(2)} GB</div>
          </div>
        </div>

        <div className={legend}>
          <div className={[colorBox, 'free'].join(' ')} />
          <div className={labelContainer}>
            <div className={label}>{g('FreeSpace')}</div>
            <div className={size}>{freeSpace.toFixed(2)} GB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiskCapacityBarChart;
