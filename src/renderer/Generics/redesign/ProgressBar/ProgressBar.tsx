import {
  captionText,
  cardDownloadingProgressContainer,
  downloadingProgressContainer,
  innerDiv,
  outerDiv,
  sectionFont,
} from './progressBar.css';

export interface ProgressBarProps {
  /**
   * Percent. undefined (not-started) or between 0 and 100
   */
  progress?: number;
  title?: string;
  caption?: string;
  color?: string;
  card?: boolean;
  outerStyle?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
}

const ProgressBar = ({
  progress,
  title,
  caption,
  color,
  card,
  outerStyle,
  innerStyle,
}: ProgressBarProps) => {
  let progressWidth = 0;
  if (progress) {
    if (progress > 100) {
      progressWidth = 100;
    } else if (progress < 0) {
      progressWidth = 0;
    } else {
      progressWidth = progress;
    }
  }
  const downloadContainer = card
    ? cardDownloadingProgressContainer
    : downloadingProgressContainer;
  return (
    <div className={downloadContainer}>
      <div className={sectionFont}>{title}</div>
      <div className={outerDiv} style={outerStyle}>
        <div
          style={{
            ...innerStyle,
            width: `${progressWidth}%`,
            backgroundColor: color,
          }}
          className={innerDiv}
        />
      </div>{' '}
      <p className={captionText}>{caption}</p>
    </div>
  );
};

export default ProgressBar;
