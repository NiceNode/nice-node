import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MetricData } from 'common/node';

type ChartStyleProp = {
  linearGradient: string[];
  lineColor: string;
  toolTipColor: string;
};

type ChartProps = {
  tabId: string;
  data: MetricData[];
};

export const Chart = ({ tabId, data }: ChartProps) => {
  const getChartProps = () => {
    let chartProps = {
      linearGradient: [],
      lineColor: '',
      toolTipColor: '',
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
        };
    }
    return chartProps;
  };

  const { linearGradient, lineColor, toolTipColor } = getChartProps();

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
        name: '',
        data:
          data !== undefined
            ? JSON.parse(JSON.stringify(data))
            : [{ x: 0, y: 0 }],
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
      },
    ],
    tooltip: {
      backgroundColor: toolTipColor,
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

  return (
    <div className="charts">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};
