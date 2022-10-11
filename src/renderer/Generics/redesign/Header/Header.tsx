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
} from './header.css';

export interface HeaderProps {
  /**
   * Node title
   */
  title: string;
  /**
   * Node info
   */
  info: string;
  /**
   * Version info
   */
  version?: string;
  /**
   * Which icon?
   */
  iconId: NodeIconId;
}

/**
 * Primary UI component for user interaction
 */
export const Header = ({ iconId, version, title, info }: HeaderProps) => {
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
        <Button
          label="Update Available"
          primary
          iconId="down"
          variant="icon-right"
          size="small"
        />
        <Button label="Stop" iconId="stop" variant="icon-left" size="small" />
        <Button iconId="settings" variant="icon" size="small" />
      </div>
    </div>
  );
};
