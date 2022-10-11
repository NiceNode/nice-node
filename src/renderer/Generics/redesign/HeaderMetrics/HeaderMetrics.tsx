import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import Button from '../Button/Button';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import {
  container,
  iconContainer,
  textContainer,
  titleContainer,
  titleStyle,
  versionContainer,
  infoStyle,
  buttonContainer,
} from './headerMetrics.css';

export interface HeaderMetricsProps {
  /**
   * Node status
   */
  status: string;
  /**
   * Current slot
   */
  slot: number;
  /**
   * Current CPU Load
   */
  cpuLoad?: number;
  /**
   * How much disk space is this node using?
   */
  diskUsage: number;
  /**
   * Is this header being shown on multiple clients screen? // TODO: Find a better way to do this
   */
  multiple: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const HeaderMetrics = ({
  status,
  slot,
  cpuLoad,
  diskUsage,
  multiple,
}: HeaderMetricsProps) => {
  return (
    <div className={container}>
      <div className={iconContainer}>
        <NodeIcon iconId={iconId} size="large" />
      </div>
      <div className={textContainer}>
        <div className={titleContainer}>
          <div className={titleStyle}>{title}</div>
          {version && <div className={versionContainer}>{version}</div>}
        </div>
        <div className={infoStyle}>{info}</div>
      </div>
      <div className={buttonContainer}>
        {update && (
          <Button
            label="Update Available"
            primary
            iconId="down"
            variant="icon-right"
            size="small"
          />
        )}
        <Button {...buttonProps} variant="icon-left" size="small" />
        <Button iconId="settings" variant="icon" size="small" />
      </div>
    </div>
  );
};
