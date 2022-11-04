import { useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import ProgressBar, { ProgressBarProps } from './ProgressBar';

export interface TimedProgressBarProps extends ProgressBarProps {
  totalTimeSeconds: number;
}

const timeRemainingCaption = (
  t: TFunction<'genericComponents', undefined>,
  totalTime: number,
  timeElapsed: number
) => {
  if (timeElapsed >= totalTime) {
    return t('FinishingUp');
  }
  return t('AboutSecondsRemaining', {
    seconds: Math.round(totalTime - timeElapsed),
  });
};

const TimedProgressBar = ({
  totalTimeSeconds,
  ...restProps
}: TimedProgressBarProps) => {
  const { t } = useTranslation('genericComponents');
  const [sElapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProgressBar
      progress={(sElapsedSeconds / totalTimeSeconds) * 100}
      caption={timeRemainingCaption(t, totalTimeSeconds, sElapsedSeconds)}
      {...restProps}
    />
  );
};

export default TimedProgressBar;
