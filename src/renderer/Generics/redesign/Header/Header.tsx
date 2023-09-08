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
  const {
    name,
    displayName,
    title,
    info,
    screenType,
    status,
    version,
    onAction,
  } = props;

  const [isCalloutDisplayed, setIsCalloutDisplayed] = useState<boolean>(false);
  const [isSettingsDisplayed, setIsSettingsDisplayed] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  let startStopButtonProps: ButtonProps = {
    label: '',
    iconId: undefined,
    onClick: () => {},
  };
  const startButtonProps: ButtonProps = {
    label: 'Resume',
    iconId: 'play',
    onClick: () => {
      if (onAction) onAction('start');
    },
  };
  const stopButtonProps: ButtonProps = {
    label: 'Stop',
    iconId: 'stop',
    onClick: () => {
      if (onAction) onAction('stop');
    },
  };
  if (!status.stopped) {
    startStopButtonProps = stopButtonProps;
  } else {
    // const text = status.initialized ? 'Resume' : 'Start';
    startStopButtonProps = startButtonProps;
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
          <div className={titleStyle}>{title || displayName || name}</div>
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
        {/* In case of the status being an error, we should show both start & stop buttons so the user can try
        both actions in the attempt to get the node working again. */}
        {status.error ? (
          <>
            <Button
              {...startButtonProps}
              variant="icon-left"
              size="small"
              type={'primary'}
            />
            <Button
              {...stopButtonProps}
              variant="icon-left"
              size="small"
              type={'secondary'}
            />
          </>
        ) : (
          <Button
            {...startStopButtonProps}
            variant="icon-left"
            size="small"
            type={
              startStopButtonProps.iconId === 'play' ? 'primary' : 'secondary'
            }
          />
        )}
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
                dispatch(
                  setModalState({
                    isModalOpen: true,
                    screen: { route: 'nodeSettings', type: 'modal' },
                  }),
                );
                // setIsSettingsDisplayed(!isSettingsDisplayed);
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
