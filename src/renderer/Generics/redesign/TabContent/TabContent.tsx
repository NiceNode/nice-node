import React from 'react';
import { MetricData } from 'common/node';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import { container, contentHeader, contentTitle } from './tabContent.css';
import LabelValues from '../LabelValues/LabelValues';
import {
  getBreakdown,
  processMinMaxAverage,
  roundAndFormatPercentage,
} from './utils';
import { Chart } from '../Chart/Chart';
import DiskCapacityBarChart from '../DiskCapacityBarChart/DiskCapacityBarChart';
import { NodeBackgroundId } from '../../../assets/images/nodeBackgrounds';

type DiskDataType = {
  diskFree: number;
  diskTotal: number;
};
export interface TabContentProps {
  tabId: string;
  metricData?: MetricData[];
  diskData?: DiskDataType;
  name: NodeBackgroundId;
}

export interface PeriodBreakdownDataProps {
  sync: {
    maximumBlocksBehind: string;
    minimumBlockTime: string;
    maximumBlockTime: string;
    averageBlockTime: string;
    totalDownTime: string;
  };
  cpu: {
    minimumUsage: string;
    maxUsage: string;
    averageUsage: string;
  };
  memory: {
    minimumUsage: string;
    maxUsage: string;
    averageUsage: string;
  };
  network: {
    dataReceived: string;
    dataSent: string;
    highestPeerCount: string;
    lowestPeerCount: string;
    averagePeerCount: string;
    highestDownloadSpeed: string;
    lowestDownloadSpeed: string;
    averageDownloadSpeed: string;
    highestUploadSpeed: string;
    lowestUploadSpeed: string;
    averageUploadSpeed: string;
  };
  disk: {
    dataWritten: string;
    dataRead: string;
    highestWriteSpeed: string;
    lowestWriteSpeed: string;
    averageWriteSpeed: string;
    highestReadSpeed: string;
    lowestReadSpeed: string;
    averageReadSpeed: string;
  };
}

type SectionLabelProps = {
  [key: string]: string;
};

const contentLabels: SectionLabelProps = {
  Sync: 'Synchronization',
  CPU: 'CPU usage',
  Memory: 'Memory usage',
  Network: 'Network',
  Disk: 'Disk',
};

const TabContent = ({ tabId, metricData, name, diskData }: TabContentProps) => {
  // switch statement here to determine which charts and sections to show?

  const processPeriodBreakdownData = () => {
    if (tabId === 'CPU' || tabId === 'Memory') {
      const results = processMinMaxAverage(metricData);
      return {
        [tabId.toLowerCase()]: {
          minimumUsage: roundAndFormatPercentage(results.lowest),
          maxUsage: roundAndFormatPercentage(results.highest),
          averageUsage: roundAndFormatPercentage(results.average),
        },
      };
    }
    return {};
  };

  const renderDiskCapacity = () => {
    if (tabId === 'Disk') {
      const clientSpace = (metricData && metricData[0]?.y) || 0;
      const { diskFree, diskTotal } = diskData as DiskDataType;
      return (
        <>
          <div className={contentHeader}>
            <div className={contentTitle}>Capacity</div>
          </div>
          <DiskCapacityBarChart
            freeSpace={diskFree}
            clientSpace={clientSpace}
            totalSpace={diskTotal}
            name={name}
          />
          <HorizontalLine type="content" />
        </>
      );
    }
    return null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const breakdownData: { title: string; items: any[] } = {
    title: 'Period breakdown',
    items: getBreakdown(tabId.toLowerCase(), processPeriodBreakdownData()),
  };

  return (
    <div className={container}>
      {renderDiskCapacity()}
      <div className={contentHeader}>
        <div className={contentTitle}>{contentLabels[tabId]}</div>
        {/* <div className={contentPeriod}>Dropdown</div> */}
      </div>
      <Chart metricData={metricData} tabId={tabId} />
      <HorizontalLine type="content" />
      {tabId !== 'Disk' && (
        <div className="breakdown">
          <LabelValues {...breakdownData} />
        </div>
      )}
    </div>
  );
};

const areEqual = (
  prevProps: Readonly<TabContentProps>,
  nextProps: Readonly<TabContentProps>
): boolean => {
  // this prevents unnecessary rerenders
  if (nextProps.name !== prevProps.name) return false; // render when tab is changed
  if (nextProps.metricData === undefined) return true; // don't render when metricData doesn't exist for node yet (initial run)
  if (prevProps.metricData === undefined && nextProps.metricData !== undefined)
    // render when metricData is fetched for the node
    return false;
  if (!prevProps.metricData || !nextProps.metricData) return false;
  return prevProps.metricData.length === nextProps.metricData.length; // don't render when metricData length is the same (no new metricData)
};

export default React.memo(TabContent, areEqual);
