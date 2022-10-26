import { useState } from 'react';
import { NodeIconId } from 'renderer/assets/images/nodeIcons';
import Button from '../Button/Button';
import { ClientStatusProps } from '../consts';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import { UpdateCallout } from '../UpdateCallout/UpdateCallout';
import {
  container,
  iconContainer,
  textContainer,
  titleContainer,
  titleStyle,
  versionContainer,
  infoStyle,
  buttonContainer,
  updateCallout,
} from './header.css';

export interface HeaderProps {
  nodeOverview: {
    name: string;
    title?: string;
    info: string;
    type: string;
    version?: string;
    update?: string;
    status: ClientStatusProps;
    stats: {
      peers: number;
      block: string;
      cpuLoad: number;
      diskUsage: number;
    };
  };
}

/**
 * Primary UI component for user interaction
 */
export const Header = ({ nodeOverview }: HeaderProps) => {
  const {
    name,
    title,
    info,
    type,
    status: { updateAvailable },
    version,
  } = nodeOverview;

  const [isCalloutDisplayed, setIsCalloutDisplayed] = useState<boolean>(false);

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
          <div className={titleStyle}>{title || name}</div>
          {version && <div className={versionContainer}>{version}</div>}
        </div>
        <div className={infoStyle}>{info}</div>
      </div>
      <div className={buttonContainer}>
        {updateAvailable && (
          <div
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsCalloutDisplayed(false);
              }
            }}
          >
            <Button
              label="Update Available"
              primary
              iconId="down"
              variant="icon-right"
              size="small"
              onClick={() => {
                setIsCalloutDisplayed(true);
              }}
            />
            {isCalloutDisplayed && (
              // tabindex hack to keep focus, and allow blur behavior
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              <div className={updateCallout} tabIndex={0}>
                <UpdateCallout
                  onClick={() => {
                    console.log('clicked!');
                  }}
                />
              </div>
            )}
          </div>
        )}
        <Button {...buttonProps} variant="icon-left" size="small" />
        <Button iconId="settings" variant="icon" size="small" />
      </div>
    </div>
  );
};
