import { Icon } from '../Icon/Icon';
import {
  container,
  infoStyle,
  dateStyle,
  typeStyle,
  messageStyle,
} from './logMessage.css';

export interface LogMessageProps {
  /**
   * Date
   */
  date: string;
  /**
   * Type
   */
  type: string;
  /**
   * Message>
   */
  message: string;
}

export const LogMessage = ({ date, type, message }: LogMessageProps) => {
  const getTooltip = () => {
    if (true) {
      return <Icon iconId="infocirclefilled" />;
    }
    return null;
  };
  const tooltip = getTooltip();
  return (
    <div className={container}>
      <div className={infoStyle}>{tooltip}</div>
      <div className={dateStyle}>{date}</div>
      <div className={[typeStyle, `${type}`].join(' ')}>{type}</div>
      <div className={messageStyle}>{message}</div>
    </div>
  );
};
