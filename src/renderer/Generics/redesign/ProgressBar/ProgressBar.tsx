import {
  captionText,
  cardDownloadingProgressContainer,
  downloadingProgressContainer,
  innerDiv,
  outerDiv,
  percentTextLeft,
  percentTextRight,
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
  showPercent?: boolean;
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
  showPercent = false,
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

  // Decide on the text position based on the progress percentage
  const isLeftPosition = progress && progress > 12;
  const percentTextClass = isLeftPosition ? percentTextLeft : percentTextRight;

  return (
    <div className={downloadContainer}>
      <div className={sectionFont}>{title}</div>
      <div className={outerDiv} style={outerStyle}>
        <div
          style={{
            ...innerStyle,
            width: `${progressWidth}%`,
            backgroundColor: color,
            position: 'relative',
          }}
          className={innerDiv}
        >
          {showPercent && progress !== 0 && (
            <span
              className={percentTextClass}
              style={{
                color: isLeftPosition ? 'white' : color,
                left: isLeftPosition ? 'auto' : `${progressWidth * 2.5 + 10}px`, // TODO: come up with a better way to do this
                transform: isLeftPosition
                  ? 'translateX(0) translateY(-50%)'
                  : '', // Handle position
              }}
            >
              {Math.floor(progress)}%
            </span>
          )}
        </div>
      </div>
      <p className={captionText}>{caption}</p>
    </div>
  );
};

export default ProgressBar;
