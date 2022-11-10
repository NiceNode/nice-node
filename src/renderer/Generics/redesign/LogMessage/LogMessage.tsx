import {
  container,
  infoStyle,
  timestampStyle,
  typeStyle,
  messageStyle,
} from './logMessage.css';

export interface LogMessageProps {
  /**
   * Timestamp
   */
  timestamp: string;
  /**
   * Type
   */
  type: string;
  /**
   * Message>
   */
  message: string;
}

export const LogMessage = ({ timestamp, type, message }: LogMessageProps) => {
  return (
    <div className={container}>
      <div className={infoStyle}>i</div>
      <div className={timestampStyle}>{timestamp}</div>
      <div className={[typeStyle, `${type}`].join(' ')}>{type}</div>
      <div className={messageStyle}>{message}</div>
    </div>
  );
};
