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
import { common } from '../theme.css';

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
  const { t } = useTranslation();

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
            <div className={label}>{t('Other')}</div>
            <div className={size}>{otherSpace.toFixed(2)} GB</div>
          </div>
        </div>

        <div className={legend}>
          <div
            className={colorBox}
            style={{ backgroundColor: common.color[name] }}
          />
          <div className={labelContainer}>
            <div className={label}>
              {capitalize(name)} {t('Client')}
            </div>
            <div className={size}>{clientSpace.toFixed(2)} GB</div>
          </div>
        </div>

        <div className={legend}>
          <div className={[colorBox, 'free'].join(' ')} />
          <div className={labelContainer}>
            <div className={label}>Free Space</div>
            <div className={size}>{freeSpace.toFixed(2)} GB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiskCapacityBarChart;
