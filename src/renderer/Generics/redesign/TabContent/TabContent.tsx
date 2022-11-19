import React, { useState } from 'react';
import { container } from './tabContent.css';
import LabelValues from '../LabelValues/LabelValues';

export interface TabContentProps {
  tabId: string;
}

export const TabContent = ({ tabId }: TabContentProps) => {
  const renderContent = () => {};
  // switch statement here to determine which charts and sections to show?

  // format data passed into TabContent as this?
  const granularNodeData = {
    sync: {
      maximumBlocksBehind: '2',
      minimumBlockTime: '98ms',
      maximumBlockTime: '98ms',
      averageBlockTime: '98ms',
      totalDownTime: '98ms',
    },
    cpu: {
      minimumUsage: '12%',
      maxUsage: '83%',
      averageUsage: '50%',
    },
    memory: {
      minimumUsage: '12%',
      maxUsage: '83%',
      averageUsage: '50%',
    },
    network: {
      dataReceived: '6.62 GB',
      dataSent: '358.1 MB',
      highestPeerCount: '23',
      lowestPeerCount: '13',
      averagePeerCount: '18',
      highestDownloadSpeed: '23.9 MB/s',
      lowestDownloadSpeed: '25 KB/s',
      averageDownloadSpeed: '4.2 MB/s',
      highestUploadSpeed: '2.9 MB/s',
      lowestUploadSpeed: '0 KB/s',
      averageUploadSpeed: '126 KB/s',
    },
  };

  const breakdownData: { title: string; items: any[] } = {
    title: 'Period breakdown',
    items: [
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
  };

  return (
    <div className={container}>
      <div className="breakdown">
        <LabelValues {...breakdownData} />
      </div>
    </div>
  );
};
