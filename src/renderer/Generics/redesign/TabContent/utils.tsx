import { MetricData } from 'common/node';
import { PeriodBreakdownDataProps } from './TabContent';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }
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
  periodBreakdownData: Partial<PeriodBreakdownDataProps>
) => {
  const breakDownObjects: BreakDownObjects = {
    sync: [
      {
        key: 'synchronization',
        sectionTitle: 'Synchronization',
        items: [
          {
            label: 'Maximum blocks behind',
            value: periodBreakdownData?.sync?.maximumBlocksBehind,
          },
          {
            label: 'Minimum block time',
            value: periodBreakdownData?.sync?.minimumBlockTime,
          },
          {
            label: 'Maximum block time',
            value: periodBreakdownData?.sync?.maximumBlockTime,
          },
          {
            label: 'Average block time',
            value: periodBreakdownData?.sync?.averageBlockTime,
          },
          {
            label: 'Total downtime',
            value: periodBreakdownData?.sync?.maximumBlocksBehind,
          },
        ],
      },
      {
        key: 'peers',
        sectionTitle: 'Peers',
        items: [
          {
            label: 'Highest peer count',
            value: periodBreakdownData?.network?.highestPeerCount,
          },
          {
            label: 'Lowest peer count',
            value: periodBreakdownData?.network?.lowestPeerCount,
          },
          {
            label: 'Average peer count',
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
            label: 'Minimum usage',
            value: periodBreakdownData?.cpu?.minimumUsage,
          },
          {
            label: 'Max usage',
            value: periodBreakdownData?.cpu?.maxUsage,
          },
          {
            label: 'Average usage',
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
            label: 'Minimum usage',
            value: periodBreakdownData?.memory?.minimumUsage,
          },
          {
            label: 'Max usage',
            value: periodBreakdownData?.memory?.maxUsage,
          },
          {
            label: 'Average usage',
            value: periodBreakdownData?.memory?.averageUsage,
          },
        ],
      },
    ],
    network: [
      {
        key: 'data',
        sectionTitle: 'Data',
        items: [
          {
            label: 'Data received',
            value: periodBreakdownData?.network?.dataReceived,
          },
          {
            label: 'Data sent',
            value: periodBreakdownData?.network?.dataSent,
          },
        ],
      },
      {
        key: 'peers',
        sectionTitle: 'Peers',
        items: [
          {
            label: 'Highest peer count',
            value: periodBreakdownData?.network?.highestPeerCount,
          },
          {
            label: 'Lowest peer count',
            value: periodBreakdownData?.network?.lowestPeerCount,
          },
          {
            label: 'Average peer count',
            value: periodBreakdownData?.network?.averagePeerCount,
          },
        ],
      },
      {
        key: 'download',
        sectionTitle: 'Download',
        items: [
          {
            label: 'Highest download speed',
            value: periodBreakdownData?.network?.highestDownloadSpeed,
          },
          {
            label: 'Lowest download speed',
            value: periodBreakdownData?.network?.lowestDownloadSpeed,
          },
          {
            label: 'Average download speed',
            value: periodBreakdownData?.network?.averageDownloadSpeed,
          },
        ],
      },
    ],
    disk: [
      {
        key: 'data',
        sectionTitle: 'Data',
        items: [
          {
            label: 'Data written',
            value: periodBreakdownData?.disk?.dataWritten,
          },
          {
            label: 'Data read',
            value: periodBreakdownData?.disk?.dataRead,
          },
        ],
      },
      {
        key: 'write',
        sectionTitle: 'Write',
        items: [
          {
            label: 'Highest write speed',
            value: periodBreakdownData?.disk?.highestWriteSpeed,
          },
          {
            label: 'Lowest write speed',
            value: periodBreakdownData?.disk?.lowestWriteSpeed,
          },
          {
            label: 'Average write speed',
            value: periodBreakdownData?.disk?.averageWriteSpeed,
          },
        ],
      },
      {
        key: 'read',
        sectionTitle: 'Read',
        items: [
          {
            label: 'Highest read speed',
            value: periodBreakdownData?.disk?.highestReadSpeed,
          },
          {
            label: 'Lowest read speed',
            value: periodBreakdownData?.disk?.lowestReadSpeed,
          },
          {
            label: 'Average read speed',
            value: periodBreakdownData?.disk?.averageReadSpeed,
          },
        ],
      },
    ],
  };

  return breakDownObjects[tabId];
};
