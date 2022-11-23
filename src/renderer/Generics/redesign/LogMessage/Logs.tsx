import React, { SetStateAction, useState, useEffect } from 'react';
import moment from 'moment';
import {
  container,
  filterContainer,
  textFilterContainer,
  typeFilterContainer,
  timeframeFilterContainer,
  filterMenu,
  logsContainer,
  spacer,
  clearFilters,
} from './logs.css';
import { Menu } from '../Menu/Menu';
import { MenuItem } from '../MenuItem/MenuItem';
import { LogMessage } from './LogMessage';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { LogWithMetadata } from '../../../../main/util/nodeLogUtils';

export interface LogsProps {
  /**
   * sLogs props
   */
  sLogs: LogWithMetadata[];
  onClickCloseButton: () => void;
}

const timeframes = {
  '30MINUTES': 30,
  '1HOUR': 60,
  '6HOURS': 360,
  '12HOURS': 720,
  '1DAY': 1440,
  '3DAYS': 4320,
  '1WEEK': 10080,
  '1MONTH': 43800,
};

type TimeframeLabelProps = {
  [key: number]: string;
};

type TypeLabelProps = {
  [key: string]: string;
};

const typeLabels: TypeLabelProps = {
  '': 'All message types',
  INFO: 'Info',
  WARN: 'Warnings',
  ERROR: 'Errors',
};

const timeframeLabels: TimeframeLabelProps = {
  0: 'All timeframes',
  30: 'Last 30 minutes',
  60: 'Last hour',
  360: 'Last 6 hours',
  720: 'Last 12 hours',
  1440: 'Last day',
  4320: 'Last 3 days',
  10080: 'Last week',
  43800: 'Last month',
};

const isWithinTimeframe = (timestamp: number, timeframe: number) => {
  const nowTime = moment().format();
  const beforeTime = moment().subtract(timeframe, 'minutes').format();
  return moment(timestamp).isBetween(beforeTime, nowTime);
};

export const Logs = ({ sLogs, onClickCloseButton }: LogsProps) => {
  const [logs, setLogs] = useState<LogWithMetadata[]>([]);
  const [isFilterBarDisplayed, setIsFilterBarDisplayed] =
    useState<boolean>(false);
  const [isTypeFilterDisplayed, setIsTypeFilterDisplayed] =
    useState<boolean>(false);
  const [isTimeframeFilterDisplayed, setIsTimeframeFilterDisplayed] =
    useState<boolean>(false);
  const [timeframeFilter, setTimeframeFilter] = useState<number>(0);
  const [textFilter, setTextFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const onClickSetTypeFilter = (type: string) => {
    if (typeFilter !== '') {
      setTypeFilter('');
    } else {
      setTypeFilter(type);
    }
  };

  const onClickSetTimeframeFilter = (timeframe: SetStateAction<number>) => {
    if (timeframeFilter !== 0 && timeframeFilter === timeframe) {
      setTimeframeFilter(0);
    } else {
      setTimeframeFilter(timeframe);
    }
  };

  const filteredLogMessages = logs
    .filter((log: LogWithMetadata) => {
      if (
        (typeFilter === '' || log.level === typeFilter) &&
        (textFilter === '' || log.message.includes(textFilter)) &&
        (timeframeFilter === 0 ||
          (log.timestamp && isWithinTimeframe(log.timestamp, timeframeFilter)))
      ) {
        return true;
      }
      return false;
    })
    .map((log: LogWithMetadata) => (
      <React.Fragment key={`${log.timestamp}${log.message}`}>
        <LogMessage {...log} />
      </React.Fragment>
    ));

  const filterExists =
    timeframeFilter !== 0 || typeFilter !== '' || textFilter !== '';

  const resetFilters = () => {
    setTextFilter('');
    setTypeFilter('');
    setTimeframeFilter(0);
  };

  useEffect(() => {
    setLogs(sLogs);
  }, [sLogs]);

  const typeLabel = typeLabels[typeFilter];
  const timeframeLabel = timeframeLabels[timeframeFilter];

  return (
    <>
      <div className={container}>
        <div>
          <ContentHeader
            textAlign="left"
            title="Logs"
            leftButtonIconId="down"
            rightButtonIconId="filter"
            leftButtonOnClick={onClickCloseButton}
            rightButtonOnClick={() => {
              if (isFilterBarDisplayed) {
                setIsFilterBarDisplayed(false);
              } else {
                setIsFilterBarDisplayed(true);
              }
            }}
          />
          {isFilterBarDisplayed && (
            <div className={filterContainer}>
              <div className={textFilterContainer}>
                <Input
                  leftIconId="search"
                  value={textFilter}
                  placeholder="Search..."
                  onChange={(text: string) => {
                    setTextFilter(text);
                  }}
                />
              </div>
              <div
                className={typeFilterContainer}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsTypeFilterDisplayed(false);
                  }
                }}
              >
                <Button
                  spaceBetween
                  wide
                  iconId="down"
                  size="small"
                  variant="icon-right"
                  label={typeLabel}
                  onClick={() => {
                    if (isTypeFilterDisplayed) {
                      setIsTypeFilterDisplayed(false);
                    } else {
                      setIsTypeFilterDisplayed(true);
                    }
                  }}
                />
                {isTypeFilterDisplayed && (
                  <div className={filterMenu}>
                    <Menu width={158}>
                      <MenuItem
                        variant="checkbox"
                        selected={typeFilter === 'INFO'}
                        status="blue"
                        text="Info"
                        onClick={() => onClickSetTypeFilter('INFO')}
                      />
                      <MenuItem
                        variant="checkbox"
                        selected={typeFilter === 'WARN'}
                        status="orange"
                        text="Warnings"
                        onClick={() => onClickSetTypeFilter('WARN')}
                      />
                      <MenuItem
                        variant="checkbox"
                        selected={typeFilter === 'ERROR'}
                        status="red"
                        text="Errors"
                        onClick={() => onClickSetTypeFilter('ERROR')}
                      />
                    </Menu>
                  </div>
                )}
              </div>
              <div
                className={timeframeFilterContainer}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsTimeframeFilterDisplayed(false);
                  }
                }}
              >
                <Button
                  iconId="down"
                  size="small"
                  variant="icon-right"
                  label={timeframeLabel}
                  onClick={() => {
                    if (isTimeframeFilterDisplayed) {
                      setIsTimeframeFilterDisplayed(false);
                    } else {
                      setIsTimeframeFilterDisplayed(true);
                    }
                  }}
                />
                {isTimeframeFilterDisplayed && (
                  <div className={filterMenu}>
                    <Menu width={148}>
                      <MenuItem
                        text="Last 30 minutes"
                        selectable
                        selected={timeframeFilter === timeframes['30MINUTES']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['30MINUTES'])
                        }
                      />
                      <MenuItem
                        text="Last hour"
                        selectable
                        selected={timeframeFilter === timeframes['1HOUR']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1HOUR'])
                        }
                      />
                      <MenuItem
                        text="Last 6 hours"
                        selectable
                        selected={timeframeFilter === timeframes['6HOURS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['6HOURS'])
                        }
                      />
                      <MenuItem
                        text="Last 12 hours"
                        selectable
                        selected={timeframeFilter === timeframes['12HOURS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['12HOURS'])
                        }
                      />
                      <MenuItem
                        text="Last day"
                        selectable
                        selected={timeframeFilter === timeframes['1DAY']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1DAY'])
                        }
                      />
                      <MenuItem
                        text="Last 3 days"
                        selectable
                        selected={timeframeFilter === timeframes['3DAYS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['3DAYS'])
                        }
                      />
                      <MenuItem
                        text="Last week"
                        selectable
                        selected={timeframeFilter === timeframes['1WEEK']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1WEEK'])
                        }
                      />
                      <MenuItem
                        text="Last month"
                        selectable
                        selected={timeframeFilter === timeframes['1MONTH']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1MONTH'])
                        }
                      />
                    </Menu>
                  </div>
                )}
              </div>
              {filterExists && (
                <>
                  <div className={spacer} />
                  <div
                    tabIndex={0}
                    role="button"
                    className={clearFilters}
                    onClick={resetFilters}
                    onKeyDown={resetFilters}
                  >
                    Clear all filters
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className={logsContainer}>{filteredLogMessages}</div>
      </div>
    </>
  );
};
