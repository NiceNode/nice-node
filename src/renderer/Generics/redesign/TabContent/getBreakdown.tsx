import { PeriodBreakdownProps } from './TabContent';

export const getBreakdown = (
  tabId: string,
  granularNodeData: PeriodBreakdownProps
) => {
  const breakDownObjects = {
    sync: [
      {
        key: 'synchronization',
        sectionTitle: 'Synchronization',
        items: [
          {
            label: 'Maximum blocks behind',
            value: granularNodeData.sync.maximumBlocksBehind,
          },
          {
            label: 'Minimum block time',
            value: granularNodeData.sync.minimumBlockTime,
          },
          {
            label: 'Maximum block time',
            value: granularNodeData.sync.maximumBlockTime,
          },
          {
            label: 'Average block time',
            value: granularNodeData.sync.averageBlockTime,
          },
          {
            label: 'Total downtime',
            value: granularNodeData.sync.maximumBlocksBehind,
          },
        ],
      },
      {
        key: 'peers',
        sectionTitle: 'Peers',
        items: [
          {
            label: 'Highest peer count',
            value: granularNodeData.network.highestPeerCount,
          },
          {
            label: 'Lowest peer count',
            value: granularNodeData.network.lowestPeerCount,
          },
          {
            label: 'Average peer count',
            value: granularNodeData.network.averagePeerCount,
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
            value: granularNodeData.cpu.minimumUsage,
          },
          {
            label: 'Max usage',
            value: granularNodeData.cpu.maxUsage,
          },
          {
            label: 'Average usage',
            value: granularNodeData.cpu.averageUsage,
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
            value: granularNodeData.memory.minimumUsage,
          },
          {
            label: 'Max usage',
            value: granularNodeData.memory.maxUsage,
          },
          {
            label: 'Average usage',
            value: granularNodeData.memory.averageUsage,
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
            value: granularNodeData.network.dataReceived,
          },
          {
            label: 'Data sent',
            value: granularNodeData.network.dataSent,
          },
        ],
      },
      {
        key: 'peers',
        sectionTitle: 'Peers',
        items: [
          {
            label: 'Highest peer count',
            value: granularNodeData.network.highestPeerCount,
          },
          {
            label: 'Lowest peer count',
            value: granularNodeData.network.lowestPeerCount,
          },
          {
            label: 'Average peer count',
            value: granularNodeData.network.averagePeerCount,
          },
        ],
      },
      {
        key: 'download',
        sectionTitle: 'Download',
        items: [
          {
            label: 'Highest download speed',
            value: granularNodeData.network.highestDownloadSpeed,
          },
          {
            label: 'Lowest download speed',
            value: granularNodeData.network.lowestDownloadSpeed,
          },
          {
            label: 'Average download speed',
            value: granularNodeData.network.averageDownloadSpeed,
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
            value: granularNodeData.disk.dataWritten,
          },
          {
            label: 'Data read',
            value: granularNodeData.disk.dataRead,
          },
        ],
      },
      {
        key: 'write',
        sectionTitle: 'Write',
        items: [
          {
            label: 'Highest write speed',
            value: granularNodeData.disk.highestWriteSpeed,
          },
          {
            label: 'Lowest write speed',
            value: granularNodeData.disk.lowestWriteSpeed,
          },
          {
            label: 'Average write speed',
            value: granularNodeData.disk.averageWriteSpeed,
          },
        ],
      },
      {
        key: 'read',
        sectionTitle: 'Read',
        items: [
          {
            label: 'Highest read speed',
            value: granularNodeData.disk.highestReadSpeed,
          },
          {
            label: 'Lowest read speed',
            value: granularNodeData.disk.lowestReadSpeed,
          },
          {
            label: 'Average read speed',
            value: granularNodeData.disk.averageReadSpeed,
          },
        ],
      },
    ],
  };

  return breakDownObjects[tabId];
};
