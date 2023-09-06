import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setModalState } from '../../../state/modal';
import { useAppDispatch } from '../../../state/hooks';
import Button, { ButtonProps } from '../Button/Button';
import { NodeOverviewProps } from '../consts';
import { NodeIcon } from '../NodeIcon/NodeIcon';
import { UpdateCallout } from '../UpdateCallout/UpdateCallout';
import { Menu } from '../Menu/Menu';
import { MenuItem } from '../MenuItem/MenuItem';
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
  const { name, title, info, screenType, status, version, onAction } = props;

  const [isCalloutDisplayed, setIsCalloutDisplayed] = useState<boolean>(false);
  const [isSettingsDisplayed, setIsSettingsDisplayed] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
  if (screenType !== 'altruistic') {
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
            className={menuButtonContainer}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsCalloutDisplayed(false);
              }
            }}
          >
            <Button
              label="Update Available"
              type="primary"
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
        <Button
          {...startStopButtonProps}
          variant="icon-left"
          size="small"
          type={
            startStopButtonProps.iconId === 'play' ? 'primary' : 'secondary'
          }
        />
        {logsButtonProps !== undefined && (
          <Button
            {...logsButtonProps}
            variant="icon-left"
            size="small"
            onClick={() => {
              navigate('/main/node/logs');
            }}
          />
        )}
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
              if (screenType === 'client') {
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
                  text="Node Settings"
                  onClick={() => {
                    dispatch(
                      setModalState({
                        isModalOpen: true,
                        screen: { route: 'nodeSettings', type: 'modal' },
                      }),
                    );
                  }}
                />
                <MenuItem
                  text="Remove Node"
                  onClick={() => {
                    dispatch(
                      setModalState({
                        isModalOpen: true,
                        screen: { route: 'removeNode', type: 'alert' },
                      }),
                    );
                  }}
                />
                {/* <HorizontalLine type="menu" />
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
                /> */}
              </Menu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
