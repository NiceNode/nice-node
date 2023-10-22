import moment from 'moment';
import {
  container,
  timestampStyle,
  levelStyle,
  messageStyle,
  copyStyle,
} from './logMessage.css';
import CopyButton from '../CopyButton/CopyButton';

export interface LogMessageProps {
  /**
   * Date
   */
  timestamp?: number;
  /**
   * Level
   */
  level?: string;
  /**
   * Message>
   */
  message: string;
}

export const LogMessage = ({ timestamp, level, message }: LogMessageProps) => {
  return (
    <div className={container}>
      <div className={timestampStyle}>
        {/* docs: https://momentjs.com/docs/#/displaying/format/ */}
        {/* {moment(timestamp).format('MMM DD HH:mm:ss:SSS')} */}
        {moment(timestamp).format('MMM DD HH:mm:ss')}
      </div>
      <div className={[levelStyle, `${level}`].join(' ')}>{level}</div>
      <div className={messageStyle}>{message}</div>
      <div className={copyStyle}>
        <CopyButton data={message} />
      </div>
    </div>
  );
};
