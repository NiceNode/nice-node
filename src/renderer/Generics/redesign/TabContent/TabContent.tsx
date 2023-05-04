import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import {
  container,
  contentHeader,
  contentTitle,
  contentPeriod,
} from './tabContent.css';
import LabelValues from '../LabelValues/LabelValues';
import { getBreakdown } from './getBreakdown';
import { MetricStats } from '../MetricTypes/MetricTypes';

export interface TabContentProps {
  tabId: string;
  data: MetricStats[];
  name: string;
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

const processMinMaxAverage = (data) => {
  if (data.length === 0) {
    return {
      lowest: null,
      highest: null,
      average: null,
    };
  }

  let lowest = data[0].y;
  let highest = data[0].y;
  let sum = 0;

  for (const item of data) {
    if (item.y < lowest) {
      lowest = item.y;
    }
    if (item.y > highest) {
      highest = item.y;
    }
    sum += item.y;
  }

  const average = sum / data.length;

  return {
    lowest,
    highest,
    average,
  };
};

const roundAndFormatPercentage = (num) => {
  const roundedNum = Math.round(num);
  return `${roundedNum}%`;
};

const TabContent = ({ tabId, data, name }: TabContentProps) => {
  // switch statement here to determine which charts and sections to show?
  console.log('render for tabId: ', tabId + data);

  const processPeriodBreakdownData = () => {
    if (tabId === 'CPU' || tabId === 'Memory') {
      const results = processMinMaxAverage(data);
      return {
        [tabId.toLowerCase()]: {
          minimumUsage: roundAndFormatPercentage(results.lowest),
          maxUsage: roundAndFormatPercentage(results.highest),
          averageUsage: roundAndFormatPercentage(results.average),
        },
      };
    }
  };

  // format data passed into TabContent as this?
  // const periodBreakdownData = {
  //   sync: {
  //     maximumBlocksBehind: '2',
  //     minimumBlockTime: '98ms',
  //     maximumBlockTime: '98ms',
  //     averageBlockTime: '98ms',
  //     totalDownTime: '98ms',
  //   },
  //   cpu: {
  //     minimumUsage: '12%',
  //     maxUsage: '83%',
  //     averageUsage: '50%',
  //   },
  //   memory: {
  //     minimumUsage: '12%',
  //     maxUsage: '83%',
  //     averageUsage: '50%',
  //   },
  //   network: {
  //     dataReceived: '6.62 GB',
  //     dataSent: '358.1 MB',
  //     highestPeerCount: '23',
  //     lowestPeerCount: '13',
  //     averagePeerCount: '18',
  //     highestDownloadSpeed: '23.9 MB/s',
  //     lowestDownloadSpeed: '25 KB/s',
  //     averageDownloadSpeed: '4.2 MB/s',
  //     highestUploadSpeed: '2.9 MB/s',
  //     lowestUploadSpeed: '0 KB/s',
  //     averageUploadSpeed: '126 KB/s',
  //   },
  //   disk: {
  //     dataWritten: '6.62 GB',
  //     dataRead: '358.1 MB',
  //     highestWriteSpeed: '23',
  //     lowestWriteSpeed: '13',
  //     averageWriteSpeed: '18',
  //     highestReadSpeed: '23.9 MB/s',
  //     lowestReadSpeed: '25 KB/s',
  //     averageReadSpeed: '4.2 MB/s',
  //   },
  // };

  const chartOptions = {
    chart: {
      type: 'area',
      height: 196,
      style: {
        fontFamily: "'SF Pro', sans-serif",
      },
      backgroundColor: 'transparent',
    },
    title: {
      text: null,
    },
    xAxis: {
      type: 'datetime',
      lineColor: 'rgba(0, 0, 2, 0.01)', // Set the x-axis line color to semi-transparent red
      labels: {
        format: '{value:%H:%M}',
        style: {
          color: 'rgba(0, 0, 2, 0.4)', // Change the Y-axis text color
          fontFamily: "'SF Pro', sans-serif",
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '11px',
          lineHeight: '14px',
          fontFeatureSettings: "'tnum' on, 'lnum' on",
        },
      },
      tickLength: 0,
      minPadding: 0,
      maxPadding: 0,
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        format: '{value}%',
        style: {
          color: 'rgba(0, 0, 2, 0.4)', // Change the Y-axis text color
          fontFamily: "'SF Pro', sans-serif",
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '11px',
          lineHeight: '14px',
          fontFeatureSettings: "'tnum' on, 'lnum' on",
        },
      },
      tickPositions: [0, 25, 50, 75, 100],
      gridLineColor: 'rgba(0, 0, 2, 0.08)',
      opposite: true,
    },
    series: [
      {
        name: 'CPU Usage',
        data:
          data !== undefined
            ? JSON.parse(JSON.stringify(data))
            : [{ x: 0, y: 0 }],
        color: 'rgba(76, 128, 246, 1)',
        fillColor: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, 'rgba(19, 122, 248, 0.20)'],
            [1, 'rgba(19, 122, 248, 0.04)'],
          ],
        },
        lineWidth: 2,
        marker: {
          enabled: false,
        },
        threshold: null,
      },
    ],
    tooltip: {
      backgroundColor: 'rgba(76, 128, 246, 1)',
      borderRadius: 4,
      style: {
        color: 'rgba(255, 255, 255, 1)',
      },
      formatter() {
        return `${this.y}%`;
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };

  const renderDiskCapacity = () => {
    if (tabId === 'Disk') {
      return (
        <>
          <div className={contentHeader}>
            <div className={contentTitle}>Capacity</div>
          </div>
          <div className="contentCharts">Disk Capacity chart goes here</div>
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
      <div className="charts">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <HorizontalLine type="content" />
      <div className="breakdown">
        <LabelValues {...breakdownData} />
      </div>
    </div>
  );
};

const areEqual = (prevProps: TabContentProps, nextProps: TabContentProps) => {
  if (nextProps.name !== prevProps.name) return false;
  if (nextProps.data === undefined) return true;
  if (prevProps.data === undefined && nextProps.data !== undefined)
    return false;
  return prevProps.data.length === nextProps.data.length;
};

export default React.memo(TabContent, areEqual);
