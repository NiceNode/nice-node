import { useState } from 'react';
import Button, { ButtonProps } from '../Button/Button';
import { NodeOverviewProps } from '../consts';
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

/**
 * Primary UI component for user interaction
 */
export const Header = (props: NodeOverviewProps) => {
  const { name, title, info, type, status, version, onAction } = props;

  const [isCalloutDisplayed, setIsCalloutDisplayed] = useState<boolean>(false);

  const startStopButtonProps: ButtonProps = {
    label: '',
    iconId: undefined,
    onClick: () => {},
  };
  if (!status.stopped) {
    startStopButtonProps.label = 'Stop';
    startStopButtonProps.iconId = 'stop';
    startStopButtonProps.onClick = () => {
      if (onAction) onAction('stop');
    };
  } else {
    // const text = status.initialized ? 'Resume' : 'Start';
    startStopButtonProps.label = 'Resume';
    startStopButtonProps.iconId = 'play';
    startStopButtonProps.onClick = () => {
      if (onAction) onAction('start');
    };
  }
  let logsButtonProps: ButtonProps | undefined;
  if (type !== 'altruistic') {
    logsButtonProps = {
      label: 'Logs',
      iconId: 'logs',
      onClick: () => {
        if (onAction) onAction('logs');
      },
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
        {status.updateAvailable && (
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
                    setIsCalloutDisplayed(false);
                    console.log('clicked!');
                  }}
                />
              </div>
            )}
          </div>
        )}
        <Button
          {...startStopButtonProps}
          variant="icon-left"
          size="small"
          primary={startStopButtonProps.iconId === 'play'}
        />
        {logsButtonProps !== undefined && (
          <Button {...logsButtonProps} variant="icon-left" size="small" />
        )}
        <Button
          iconId="settings"
          variant="icon"
          size="small"
          onClick={() => {
            if (onAction) onAction('settings');
          }}
        />
      </div>
    </div>
  );
};
