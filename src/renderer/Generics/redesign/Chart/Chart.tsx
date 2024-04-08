import { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MetricData } from '../../../../common/node';
import { vars } from '../theme.css';
import { container, iconContainer, iconComponent } from './chart.css';
import { Icon } from '../Icon/Icon';

type ChartStyleProp = {
  linearGradient: string[];
  lineColor: string;
  toolTipColor: string;
  yAxisFormat: string;
};

type ChartProps = {
  tabId: string;
  metricData?: MetricData[];
};

// Function to convert GB to human-readable format (GB or TB)
const gbToSize = (gb: number, xAxis = false) => {
  if (gb < 1024) {
    return xAxis ? `GB` : `{value} GB`;
  }
  return xAxis ? `TB` : `{value} TB`;
};

const getToolTipFormat = (value: number, tabId: string) => {
  switch (tabId) {
    case 'CPU':
      return `${value}%`;
    case 'Memory':
      return `${value}%`;
    case 'Disk':
      return `${value} ${gbToSize(value, true)}`;
    default:
      return '';
  }
};

export const Chart = ({ tabId, metricData }: ChartProps) => {
  const chartComponent = useRef(null);

  useEffect(() => {
    if (chartComponent.current) {
      const { chart } = chartComponent.current as { chart: Highcharts.Chart };
      chart.series[0].setData(
        metricData !== undefined
          ? JSON.parse(JSON.stringify(metricData))
          : [{ x: Date.now(), y: 0 }],
        true,
        true,
        false, // changing this to true causes the chart to render incorrectly on the 2nd render
      );
    }
  }, [metricData]);

  const getChartProps = () => {
    let chartProps = {
      linearGradient: [],
      lineColor: '',
      toolTipColor: '',
      yAxisFormat: '',
    } as ChartStyleProp;
    switch (tabId) {
      case 'CPU':
        chartProps = {
          linearGradient: [
            'rgba(19, 122, 248, 0.20)',
            'rgba(19, 122, 248, 0.04)',
          ],
          lineColor: 'rgba(76, 128, 246, 1)',
          toolTipColor: 'rgba(76, 128, 246, 1)',
          yAxisFormat: '{value}%',
        };
        break;
      case 'Memory':
        chartProps = {
          linearGradient: [
            'rgba(247, 144, 9, 0.16)',
            'rgba(247, 144, 9, 0.04)',
          ],
          lineColor: 'rgba(247, 144, 9, 0.85)',
          toolTipColor: 'rgba(247, 144, 9, 1)',
          yAxisFormat: '{value}%',
        };
        break;
      case 'Disk':
        chartProps = {
          linearGradient: [
            'rgba(18, 186, 108, 0.16)',
            'rgba(18, 186, 108, 0.04)',
          ],
          lineColor: 'rgba(62, 187, 100, 1)',
          toolTipColor: 'rgba(62, 187, 100, 1)',
          yAxisFormat: gbToSize((metricData && metricData[0]?.y) || 0),
        };
        break;
      default:
        chartProps = {
          linearGradient: [
            'rgba(19, 122, 248, 0.20)',
            'rgba(19, 122, 248, 0.04)',
          ],
          lineColor: 'rgba(76, 128, 246, 1)',
          toolTipColor: 'rgba(76, 128, 246, 1)',
          yAxisFormat: '{value}%',
        };
    }
    return chartProps;
  };

  const { linearGradient, lineColor, toolTipColor, yAxisFormat } =
    getChartProps();

  const chartOptions = {
    chart: {
      type: 'area',
      height: 196,
      style: {
        fontFamily: "'SF Pro', sans-serif",
      },
      backgroundColor: 'transparent',
      spacingLeft: 0,
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
          color: vars.color.font40, // Change the Y-axis text color
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
        format: yAxisFormat,
        style: {
          color: vars.color.font40, // Change the Y-axis text color
          fontFamily: "'SF Pro', sans-serif",
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '11px',
          lineHeight: '14px',
          fontFeatureSettings: "'tnum' on, 'lnum' on",
        },
      },
      tickPositions: null,
      gridLineColor: vars.color.font8,
      opposite: true,
    },
    time: {
      useUTC: false,
    },
    series: [
      {
        name: '',
        color: lineColor,
        fillColor: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, linearGradient[0]],
            [1, linearGradient[1]],
          ],
        },
        lineWidth: 2,
        marker: {
          enabled: false,
        },
        threshold: null,
        turboThreshold: 0,
        animation: false,
      },
    ],
    tooltip: {
      backgroundColor: toolTipColor,
      borderRadius: 4,
      style: {
        color: 'rgba(255, 255, 255, 1)',
      },
      formatter(this: Highcharts.TooltipFormatterContextObject): string {
        const yValue = this.y || 0;
        return getToolTipFormat(yValue, tabId);
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };

  return (
    <div className={container}>
      {metricData && metricData.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          ref={chartComponent}
        />
      ) : (
        <div className={iconContainer}>
          <div className={iconComponent}>
            <Icon iconId="syncing" />
          </div>
        </div>
      )}
    </div>
  );
};
