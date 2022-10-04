import { useEffect, useState } from 'react';
import ProgressBar, { ProgressBarProps } from './ProgressBar';

export interface TimedProgressBarProps extends ProgressBarProps {
  totalTimeSeconds: number;
}

const timeRemainingCaption = (totalTime: number, timeElapsed: number) => {
  if (timeElapsed >= totalTime) {
    return 'Finishing up...';
  }
  return `About ${Math.round(totalTime - timeElapsed)} seconds remaining`;
};

const TimedProgressBar = ({
  totalTimeSeconds,
  ...restProps
}: TimedProgressBarProps) => {
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
      caption={timeRemainingCaption(totalTimeSeconds, sElapsedSeconds)}
      {...restProps}
    />
  );
};

export default TimedProgressBar;
