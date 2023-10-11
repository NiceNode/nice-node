import React, { SetStateAction, useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  container,
  filterContainer,
  textFilterContainer,
  typeFilterContainer,
  timeframeFilterContainer,
  filterMenu,
  logsScroller,
  spacer,
  clearFilters,
} from './logs.css';
import { Menu } from '../../Generics/redesign/Menu/Menu';
import { MenuItem } from '../../Generics/redesign/MenuItem/MenuItem';
import { LogMessage } from '../../Generics/redesign/LogMessage/LogMessage';
import Input from '../../Generics/redesign/Input/Input';
import Button from '../../Generics/redesign/Button/Button';
import { ContentHeader } from '../../Generics/redesign/ContentHeader/ContentHeader';
import { LogWithMetadata } from 'main/util/nodeLogUtils';
import FloatingButton from '../../Generics/redesign/FloatingButton/FloatingButton';

export interface LogsProps {
  /**
   * sLogs props
   */
  sLogs: LogWithMetadata[];
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
  '': 'AllMessageTypes',
  INFO: 'Info',
  WARN: 'Warnings',
  ERROR: 'Errors',
};

const timeframeLabels: TimeframeLabelProps = {
  0: 'AllTimeframes',
  30: 'Last30Minutes',
  60: 'LastHour',
  360: 'Last6Hours',
  720: 'Last12Hours',
  1440: 'LastDay',
  4320: 'Last3Days',
  10080: 'LastWeek',
  43800: 'LastMonth',
};

const isWithinTimeframe = (timestamp: number, timeframe: number) => {
  const nowTime = moment().format();
  const beforeTime = moment().subtract(timeframe, 'minutes').format();
  return moment(timestamp).isBetween(beforeTime, nowTime);
};

export const Logs = ({ sLogs }: LogsProps) => {
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
    if (typeFilter === type) {
      setTypeFilter('');
    } else {
      setTypeFilter(type);
    }
  };
  const { t } = useTranslation();

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
    .map((log: LogWithMetadata, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={`${log.timestamp}${log.message}${index}`}>
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

  const [isButtonVisible, setButtonVisible] = useState<boolean>(false);
  const [hasUserScrolledToBottom, setUserScrolledToBottom] =
    useState<boolean>(true);
  const [newLogsAdded, setNewLogsAdded] = useState<boolean>(false);
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const [lastKnownLogCount, setLastKnownLogCount] = useState<number>(0);

  const newLogsCount = sLogs.length - lastKnownLogCount;

  useEffect(() => {
    setLogs(sLogs);

    if (sLogs.length > lastKnownLogCount) {
      if (hasUserScrolledToBottom) {
        setLastKnownLogCount(sLogs.length);
      }
      setNewLogsAdded(true);
      if (!hasUserScrolledToBottom) {
        setButtonVisible(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sLogs]);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setUserScrolledToBottom(true);
    setButtonVisible(false);
    setNewLogsAdded(false);
    setLastKnownLogCount(sLogs.length);
  };

  useEffect(() => {
    const { current } = logContainerRef;
    const handleScroll = () => {
      if (
        current &&
        current.scrollTop + current.clientHeight >= current.scrollHeight
      ) {
        setUserScrolledToBottom(true);
        setButtonVisible(false);
        setNewLogsAdded(false);
        setLastKnownLogCount(sLogs.length);
      } else {
        setUserScrolledToBottom(false);
      }
    };

    current?.addEventListener('scroll', handleScroll);

    return () => current?.removeEventListener('scroll', handleScroll);
  }, [sLogs, hasUserScrolledToBottom, newLogsAdded]);

  const floatingButtonLabel =
    newLogsCount > 0 ? `${newLogsCount} ${t('NewMessages')}` : t('NewMessages');

  const typeLabel = typeLabels[typeFilter];
  const timeframeLabel = timeframeLabels[timeframeFilter];

  const navigate = useNavigate();

  return (
    <>
      <div className={container}>
        {isButtonVisible && (
          <FloatingButton
            variant="icon-right"
            iconId="down"
            label={floatingButtonLabel}
            onClick={scrollToBottom}
          />
        )}
        <div>
          <ContentHeader
            textAlign="left"
            title={t('Logs')}
            leftButtonIconId="down"
            rightButtonIconId="filter"
            leftButtonOnClick={() => navigate('/main/node')}
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
                  placeholder={t('Search')}
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
                  label={t(typeLabel)}
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
                        text={t('Info')}
                        onClick={() => onClickSetTypeFilter('INFO')}
                      />
                      <MenuItem
                        variant="checkbox"
                        selected={typeFilter === 'WARN'}
                        status="orange"
                        text={t('Warnings')}
                        onClick={() => onClickSetTypeFilter('WARN')}
                      />
                      <MenuItem
                        variant="checkbox"
                        selected={typeFilter === 'ERROR'}
                        status="red"
                        text={t('Errors')}
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
                  label={t(timeframeLabel)}
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
                        text={t('Last30Minutes')}
                        selectable
                        selected={timeframeFilter === timeframes['30MINUTES']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['30MINUTES'])
                        }
                      />
                      <MenuItem
                        text={t('LastHour')}
                        selectable
                        selected={timeframeFilter === timeframes['1HOUR']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1HOUR'])
                        }
                      />
                      <MenuItem
                        text={t('Last6Hours')}
                        selectable
                        selected={timeframeFilter === timeframes['6HOURS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['6HOURS'])
                        }
                      />
                      <MenuItem
                        text={t('Last12Hours')}
                        selectable
                        selected={timeframeFilter === timeframes['12HOURS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['12HOURS'])
                        }
                      />
                      <MenuItem
                        text={t('LastDay')}
                        selectable
                        selected={timeframeFilter === timeframes['1DAY']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1DAY'])
                        }
                      />
                      <MenuItem
                        text={t('Last3Days')}
                        selectable
                        selected={timeframeFilter === timeframes['3DAYS']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['3DAYS'])
                        }
                      />
                      <MenuItem
                        text={t('LastWeek')}
                        selectable
                        selected={timeframeFilter === timeframes['1WEEK']}
                        onClick={() =>
                          onClickSetTimeframeFilter(timeframes['1WEEK'])
                        }
                      />
                      <MenuItem
                        text={t('LastMonth')}
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
                    {t('ClearAllFilters')}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {filteredLogMessages.length === 0 && <div>No logs found</div>}
        <div ref={logContainerRef} className={logsScroller}>
          <div ref={logEndRef} />
          <div>{filteredLogMessages}</div>
        </div>
      </div>
    </>
  );
};
