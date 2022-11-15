import moment from 'moment';
import { Icon } from '../Icon/Icon';
import {
  container,
  timestampStyle,
  levelStyle,
  messageStyle,
} from './logMessage.css';

export interface LogMessageProps {
  /**
   * Date
   */
  timestamp: number;
  /**
   * Level
   */
  level: string;
  /**
   * Message>
   */
  message: string;
}

export const LogMessage = ({ timestamp, level, message }: LogMessageProps) => {
  return (
    <div className={container}>
      <div className={timestampStyle}>
        {moment(timestamp).format('MMM DD HH:MM:ss:SSS')}
      </div>
      <div className={[levelStyle, `${level}`].join(' ')}>{level}</div>
      <div className={messageStyle}>{message}</div>
    </div>
  );
};
