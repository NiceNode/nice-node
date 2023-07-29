import { ReactElement } from 'react';
import {
  container,
  textContainer,
  checkTitleClass,
  valueTextClass,
  captionTextClass,
  successIcon,
  warningIcon,
  errorIcon,
  loadingIcon,
} from './checklistItem.css';
import { Icon } from '../Icon/Icon';

/**
 * checkTitle and status required
 */
export type ChecklistItemProps = {
  /**
   * Status of the check
   */
  status: 'complete' | 'information' | 'incomplete' | 'loading' | 'error';
  /**
   * The description of what is being checked
   */
  checkTitle: string;
  /**
   * The value of what is being checked
   */
  valueText?: string;
  /**
   * A custom React component to include
   */
  valueComponent?: ReactElement;
  /**
   * Additional information as a caption
   */
  captionText?: string;
};

/**
 * Primary UI component for user interaction
 */
const ChecklistItem = ({
  status,
  checkTitle,
  valueText,
  valueComponent,
  captionText,
  ...rest
}: ChecklistItemProps) => {
  let statusIcon = <></>;
  if (status === 'complete') {
    statusIcon = (
      <span className={successIcon}>
        <Icon iconId="checkcirclefilled" />
      </span>
    );
  } else if (status === 'information') {
    statusIcon = (
      <span>
        <Icon iconId="infocirclefilled" />
      </span>
    );
  } else if (status === 'incomplete') {
    statusIcon = (
      <span className={warningIcon}>
        <Icon iconId="warningcirclefilled" />
      </span>
    );
  } else if (status === 'loading') {
    statusIcon = (
      <span className={loadingIcon}>
        <Icon iconId="spinnerendless" />
      </span>
    );
  } else if (status === 'error') {
    statusIcon = (
      <span className={errorIcon}>
        <Icon iconId="warningcirclefilled" />
      </span>
    );
  }
  return (
    <div className={container} {...rest}>
      {statusIcon}
      <div className={textContainer}>
        <span className={checkTitleClass}>{checkTitle}</span>
        <span className={valueTextClass}>
          {valueText} <br />
          {valueComponent}
        </span>
        <span className={captionTextClass}>{captionText}</span>
      </div>
    </div>
  );
};

export default ChecklistItem;
