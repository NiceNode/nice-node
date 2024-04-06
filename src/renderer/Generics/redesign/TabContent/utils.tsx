import { MetricData } from '../../../../common/node';
import { PeriodBreakdownDataProps } from './TabContent';
import i18n from '../../../i18n';

interface BreakDownObjects {
  sync: {
    key: string;
    sectionTitle: string;
    items: { label: string; value: string | undefined }[];
  }[];
  cpu: { key: string; items: { label: string; value: string | undefined }[] }[];
  memory: {
    key: string;
    items: { label: string; value: string | undefined }[];
  }[];
  network: {
    key: string;
    sectionTitle: string;
    items: { label: string; value: string | undefined }[];
  }[];
  disk: {
    key: string;
    sectionTitle: string;
    items: { label: string; value: string | undefined }[];
  }[];
  // eslint-disable-next-line
  [key: string]: any; // index signature
}

export const roundAndFormatPercentage = (num: number) => {
  const roundedNum = Math.round(num);
  return `${roundedNum}%`;
};

export const processMinMaxAverage = (data?: MetricData[]) => {
  if (data === undefined || data.length === 0) {
    return {
      lowest: 0,
      highest: 0,
      average: 0,
    };
  }

  const { lowest, highest, sum } = data.reduce(
    (accumulator, item) => {
      if (item.y < accumulator.lowest) {
        accumulator.lowest = item.y;
      }
      if (item.y > accumulator.highest) {
        accumulator.highest = item.y;
      }
      accumulator.sum += item.y;
      return accumulator;
    },
    {
      lowest: data[0].y,
      highest: data[0].y,
      sum: 0,
    },
  );

  const average = sum / data.length;

  return {
    lowest,
    highest,
    average,
  };
};

export const getBreakdown = (
  tabId: string,
  periodBreakdownData: Partial<PeriodBreakdownDataProps>,
) => {
  const breakDownObjects: BreakDownObjects = {
    sync: [
      {
        key: 'synchronization',
        sectionTitle: i18n.t('genericComponents:Synchronization'),
        items: [
          {
            label: i18n.t('genericComponents:MaximumBlocksBehind'),
            value: periodBreakdownData?.sync?.maximumBlocksBehind,
          },
          {
            label: i18n.t('genericComponents:MinimumBlockTime'),
            value: periodBreakdownData?.sync?.minimumBlockTime,
          },
          {
            label: i18n.t('genericComponents:MaximumBlockTime'),
            value: periodBreakdownData?.sync?.maximumBlockTime,
          },
          {
            label: i18n.t('genericComponents:AverageBlockTime'),
            value: periodBreakdownData?.sync?.averageBlockTime,
          },
          {
            label: i18n.t('genericComponents:TotalDowntime'),
            value: periodBreakdownData?.sync?.maximumBlocksBehind,
          },
        ],
      },
      {
        key: 'peers',
        sectionTitle: i18n.t('genericComponents:PeersSection'),
        items: [
          {
            label: i18n.t('genericComponents:HighestPeerCount'),
            value: periodBreakdownData?.network?.highestPeerCount,
          },
          {
            label: i18n.t('genericComponents:LowestPeerCount'),
            value: periodBreakdownData?.network?.lowestPeerCount,
          },
          {
            label: i18n.t('genericComponents:AveragePeerCount'),
            value: periodBreakdownData?.network?.averagePeerCount,
          },
        ],
      },
    ],
    cpu: [
      {
        key: 'cpu',
        items: [
          {
            label: i18n.t('genericComponents:MinimumUsage'),
            value: periodBreakdownData?.cpu?.minimumUsage,
          },
          {
            label: i18n.t('genericComponents:MaximumUsage'),
            value: periodBreakdownData?.cpu?.maxUsage,
          },
          {
            label: i18n.t('genericComponents:AverageUsage'),
            value: periodBreakdownData?.cpu?.averageUsage,
          },
        ],
      },
    ],
    memory: [
      {
        key: 'memory',
        items: [
          {
            label: i18n.t('genericComponents:MinimumUsage'),
            value: periodBreakdownData?.memory?.minimumUsage,
          },
          {
            label: i18n.t('genericComponents:MaximumUsage'),
            value: periodBreakdownData?.memory?.maxUsage,
          },
          {
            label: i18n.t('genericComponents:AverageUsage'),
            value: periodBreakdownData?.memory?.averageUsage,
          },
        ],
      },
    ],
    network: [
      {
        key: 'data',
        sectionTitle: i18n.t('genericComponents:DataSection'),
        items: [
          {
            label: i18n.t('genericComponents:DataReceived'),
            value: periodBreakdownData?.network?.dataReceived,
          },
          {
            label: i18n.t('genericComponents:DataSent'),
            value: periodBreakdownData?.network?.dataSent,
          },
        ],
      },
      {
        key: 'peers',
        sectionTitle: i18n.t('genericComponents:PeersSection'),
        items: [
          {
            label: i18n.t('genericComponents:HighestPeerCount'),
            value: periodBreakdownData?.network?.highestPeerCount,
          },
          {
            label: i18n.t('genericComponents:LowestPeerCount'),
            value: periodBreakdownData?.network?.lowestPeerCount,
          },
          {
            label: i18n.t('genericComponents:AveragePeerCount'),
            value: periodBreakdownData?.network?.averagePeerCount,
          },
        ],
      },
      {
        key: 'download',
        sectionTitle: i18n.t('genericComponents:DownloadSection'),
        items: [
          {
            label: i18n.t('genericComponents:HighestDownloadSpeed'),
            value: periodBreakdownData?.network?.highestDownloadSpeed,
          },
          {
            label: i18n.t('genericComponents:LowestDownloadSpeed'),
            value: periodBreakdownData?.network?.lowestDownloadSpeed,
          },
          {
            label: i18n.t('genericComponents:AverageDownloadSpeed'),
            value: periodBreakdownData?.network?.averageDownloadSpeed,
          },
        ],
      },
    ],
    disk: [
      {
        key: 'data',
        sectionTitle: i18n.t('genericComponents:DataSection'),
        items: [
          {
            label: i18n.t('genericComponents:DataWritten'),
            value: periodBreakdownData?.disk?.dataWritten,
          },
          {
            label: i18n.t('genericComponents:DataRead'),
            value: periodBreakdownData?.disk?.dataRead,
          },
        ],
      },
      {
        key: 'write',
        sectionTitle: i18n.t('genericComponents:WriteSection'),
        items: [
          {
            label: i18n.t('genericComponents:HighestWriteSpeed'),
            value: periodBreakdownData?.disk?.highestWriteSpeed,
          },
          {
            label: i18n.t('genericComponents:LowestWriteSpeed'),
            value: periodBreakdownData?.disk?.lowestWriteSpeed,
          },
          {
            label: i18n.t('genericComponents:AverageWriteSpeed'),
            value: periodBreakdownData?.disk?.averageWriteSpeed,
          },
        ],
      },
      {
        key: 'read',
        sectionTitle: i18n.t('genericComponents:ReadSection'),
        items: [
          {
            label: i18n.t('genericComponents:HighestReadSpeed'),
            value: periodBreakdownData?.disk?.highestReadSpeed,
          },
          {
            label: i18n.t('genericComponents:LowestReadSpeed'),
            value: periodBreakdownData?.disk?.lowestReadSpeed,
          },
          {
            label: i18n.t('genericComponents:AverageReadSpeed'),
            value: periodBreakdownData?.disk?.averageReadSpeed,
          },
        ],
      },
    ],
  };

  return breakDownObjects[tabId];
};
