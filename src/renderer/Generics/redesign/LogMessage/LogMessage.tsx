import moment from 'moment';
import {
  container,
  timestampStyle,
  levelStyle,
  messageStyle,
} from './logMessage.css';
import FloatingButton from '../FloatingButton/FloatingButton';

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
      <FloatingButton variant="icon" iconId="copy" />
    </div>
  );
};
