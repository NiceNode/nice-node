import {
  container,
  textContainer,
  checkTitleClass,
  valueTextClass,
  captionTextClass,
  successIcon,
  warningIcon,
  errorIcon,
} from './checklistItem.css';
import { ReactComponent as WarningCircleFill } from '../../../assets/images/icons/Warning-circle-filled.svg';
import { ReactComponent as CheckCircleFillIcon } from '../../../assets/images/icons/Check-circle-filled.svg';
import SpinnerIcon from '../Icons/SpinnerIcon';

/**
 * checkTitle and status required
 */
export interface ChecklistItemProps {
  /**
   * Status of the check
   */
  status: 'complete' | 'incomplete' | 'loading' | 'error';
  /**
   * The description of what is being checked
   */
  checkTitle: string;
  /**
   * The value of what is being checked
   */
  valueText?: string;
  /**
   * Additional information as a caption
   */
  captionText?: string;
}

/**
 * Primary UI component for user interaction
 */
const ChecklistItem = ({
  status,
  checkTitle,
  valueText,
  captionText,
  ...rest
}: ChecklistItemProps) => {
  let statusIcon = <></>;
  if (status === 'complete') {
    statusIcon = (
      <span className={successIcon}>
        <CheckCircleFillIcon />
      </span>
    );
  } else if (status === 'incomplete') {
    statusIcon = (
      <span className={warningIcon}>
        <WarningCircleFill />
      </span>
    );
  } else if (status === 'loading') {
    statusIcon = (
      <span>
        <SpinnerIcon />
      </span>
    );
  } else if (status === 'error') {
    statusIcon = (
      <span className={errorIcon}>
        <WarningCircleFill />
      </span>
    );
  }
  return (
    <div className={container} {...rest}>
      {statusIcon}
      <div className={textContainer}>
        <span className={checkTitleClass}>{checkTitle}</span>
        <span className={valueTextClass}>{valueText}</span>
        <span className={captionTextClass}>{captionText}</span>
      </div>
    </div>
  );
};

export default ChecklistItem;
