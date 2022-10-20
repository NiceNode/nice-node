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
  node: {
    name: string;
    title: string;
    info: string;
    type: string;
    version?: string;
    update?: string;
    status: string; // determine this by comparing 2 clients
    stats: {
      block: string;
      cpuLoad: number;
      diskUsage: number;
    };
  };
}

/**
 * Primary UI component for user interaction
 */
export const Header = ({ node }: HeaderProps) => {
  const { name, title, info, type, status, stats, version, update } = node;
  const buttonProps = {
    label: '',
    iconId: '',
    onClick: () => {},
  };
  if (type === 'altruistic') {
    if (true) {
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
        <NodeIcon iconId={name} size="large" />
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
