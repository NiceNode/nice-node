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
  /**
   * Is this header being shown on multiple clients screen? // TODO: Find a better way to do this
   */
  multiple: boolean;
  /**
   * Is the node running right now? // TODO: Differentiate between main screen vs node screen with different variable?
   */
  running?: boolean;
  /**
   * Is update available?
   */
  update?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Header = ({
  iconId,
  version,
  title,
  info,
  update,
  running,
  multiple,
}: HeaderProps) => {
  const buttonProps = {
    label: '',
    iconId: '',
    onClick: () => {},
  };
  if (multiple) {
    if (running) {
      buttonProps.label = 'Stop';
      buttonProps.iconId = 'stop';
      buttonProps.onClick = () => {
        console.log('stop node');
      };
    } else {
      buttonProps.label = 'Start';
      buttonProps.iconId = 'play';
      buttonProps.onClick = () => {
        console.log('start node');
      };
    }
  } else {
    buttonProps.label = 'Logs';
    buttonProps.iconId = 'logs';
    buttonProps.onClick = () => {
      console.log('open logs');
    };
  }

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
