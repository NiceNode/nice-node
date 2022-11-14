import moment from 'moment';
import { Icon } from '../Icon/Icon';
import {
  container,
  infoStyle,
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
      <div className={timestampStyle}>
        {moment(timestamp).format('MMM DD HH:MM:ss:SSS')}
      </div>
      <div className={[levelStyle, `${level}`].join(' ')}>{level}</div>
      <div className={messageStyle}>{message}</div>
    </div>
  );
};
