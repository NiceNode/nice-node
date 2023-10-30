import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setModalState } from '../../../state/modal';
import { useAppDispatch } from '../../../state/hooks';
import Button, { ButtonProps } from '../Button/Button';
import { NodeOverviewProps } from '../consts';
import NodeIcon from '../NodeIcon/NodeIcon';
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

type HeaderProps = {
  nodeOverview: NodeOverviewProps;
  isPodmanRunning: boolean;
};
/**
 * Primary UI component for user interaction
 */
export const Header = ({ nodeOverview, isPodmanRunning }: HeaderProps) => {
  const {
    name,
    displayName,
    title,
    info,
    screenType,
    status,
    version,
    onAction,
  } = nodeOverview;

  const [isCalloutDisplayed, setIsCalloutDisplayed] = useState<boolean>(false);
  const [isSettingsDisplayed, setIsSettingsDisplayed] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { t: g } = useTranslation('genericComponents');

  let startStopButtonProps: ButtonProps = {
    label: '',
    iconId: undefined,
    onClick: () => {},
  };
  const startButtonProps: ButtonProps = {
    label: g('Resume'),
    iconId: 'play',
    onClick: () => {
      if (onAction) onAction('start');
    },
  };
  const stopButtonProps: ButtonProps = {
    label: g('Stop'),
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
  if (screenType !== 'nodePackage') {
    logsButtonProps = {
      label: g('Logs'),
      iconId: 'scroll',
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
        {/* Temporary */}
        {name === 'prysm' && (
          <p>Prysm does not allow HTTP APIs. No node data can be retrieved.</p>
        )}
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
              label={g('UpdateAvailable')}
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
              type="primary"
            />
            <Button
              {...stopButtonProps}
              variant="icon-left"
              size="small"
              type="secondary"
            />
          </>
        ) : (
          <Button
            {...startStopButtonProps}
            variant="icon-left"
            size="small"
            disabled={isPodmanRunning === false}
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
              if (screenType === 'client' || screenType === 'nodePackage') {
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
                {screenType === 'client' && (
                  <MenuItem
                    text={g('NodeSettings')}
                    onClick={() => {
                      dispatch(
                        setModalState({
                          isModalOpen: true,
                          screen: { route: 'nodeSettings', type: 'modal' },
                        }),
                      );
                    }}
                  />
                )}
                {screenType === 'nodePackage' && (
                  <MenuItem
                    text={g('RemoveNode')}
                    onClick={() => {
                      dispatch(
                        setModalState({
                          isModalOpen: true,
                          screen: { route: 'removeNode', type: 'alert' },
                        }),
                      );
                    }}
                  />
                )}
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
