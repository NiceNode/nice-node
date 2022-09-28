import {
  outerDiv,
  innerDiv,
  captionText,
  downloadingProgressContainer,
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
}

const ProgressBar = ({ progress, title, caption, color }: ProgressBarProps) => {
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
  return (
    <div className={downloadingProgressContainer}>
      <div className={sectionFont}>
        <>{title}</>
      </div>
      <div className={outerDiv}>
        <div
          style={{ width: `${progressWidth}%`, backgroundColor: color }}
          className={innerDiv}
        />
      </div>{' '}
      <p className={captionText}>{caption}</p>
    </div>
  );
};

export default ProgressBar;
