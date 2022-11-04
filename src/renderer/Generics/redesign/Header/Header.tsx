import { useState } from 'react';
import Button, { ButtonProps } from '../Button/Button';
import { NodeOverviewProps } from '../consts';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import { UpdateCallout } from '../UpdateCallout/UpdateCallout';
import { Menu } from '../Menu/Menu';
import { MenuItem } from '../MenuItem/MenuItem';
import { HorizontalLine } from '../HorizontalLine/HorizontalLine';
import {
  container,
  iconContainer,
  textContainer,
  titleContainer,
  titleStyle,
  versionContainer,
  infoStyle,
  buttonContainer,
  popupContainer,
  menuButtonContainer,
} from './header.css';

/**
 * Primary UI component for user interaction
 */
export const Header = (props: NodeOverviewProps) => {
  const { name, title, info, type, status, version } = props;

  const [isCalloutDisplayed, setIsCalloutDisplayed] = useState<boolean>(false);
  const [isSettingsDisplayed, setIsSettingsDisplayed] =
    useState<boolean>(false);

  const buttonProps: ButtonProps = {
    label: '',
    iconId: undefined,
    onClick: () => {},
  };
  if (type === 'altruistic') {
    if (!status.stopped) {
      buttonProps.label = 'Stop';
      buttonProps.iconId = 'stop';
      buttonProps.onClick = () => {
        console.log('stop node');
      };
    } else {
      // const text = status.initialized ? 'Resume' : 'Start';
      buttonProps.label = 'Resume';
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
        {status.updateAvailable && (
          <div
            className={menuButtonContainer}
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
              <div className={popupContainer} tabIndex={0}>
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
        <Button {...buttonProps} variant="icon-left" size="small" />
        <div
          className={menuButtonContainer}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsSettingsDisplayed(false);
            }
          }}
        >
          <Button
            iconId="settings"
            variant="icon"
            size="small"
            onClick={() => {
              if (type === 'client') {
                setIsSettingsDisplayed(!isSettingsDisplayed);
              } else {
                console.log('open preferences!');
              }
            }}
          />
          {isSettingsDisplayed && (
            // tabindex hack to keep focus, and allow blur behavior
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            <div className={popupContainer} tabIndex={0}>
              <Menu width={156}>
                <MenuItem
                  text="Restart Client"
                  onClick={() => {
                    console.log('Restart Client');
                  }}
                />
                <MenuItem
                  text="Check for Updates..."
                  onClick={() => {
                    console.log('Check for Updates...');
                  }}
                />
                <HorizontalLine type="menu" />
                <MenuItem
                  text="Client Versions"
                  onClick={() => {
                    console.log('Client Versions');
                  }}
                />
                <HorizontalLine type="menu" />
                <MenuItem
                  text="Switch Client"
                  onClick={() => {
                    console.log('Switch Client');
                  }}
                  disabled
                />
              </Menu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
