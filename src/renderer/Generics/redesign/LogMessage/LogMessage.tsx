import moment from 'moment';
import {
  container,
  timestampStyle,
  levelStyle,
  messageStyle,
  copyStyle,
} from './logMessage.css';
import FloatingButton from '../FloatingButton/FloatingButton';
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
  const copy = async () => {
    await navigator.clipboard.writeText(message);
  };

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
        {/* <FloatingButton variant="icon" iconId="copy" onClick={copy} /> */}
        <CopyButton onClick={copy} />
      </div>
    </div>
  );
};
