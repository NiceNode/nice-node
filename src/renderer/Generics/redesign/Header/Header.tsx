import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { NodeSpecification } from '../../../../common/nodeSpec.js';
import { modalRoutes } from '../../../Presentational/ModalManager/modalUtils.js';
import electron from '../../../electronGlobal.js';
import { useAppDispatch } from '../../../state/hooks';
import { setModalState } from '../../../state/modal';
import Button, { type ButtonProps } from '../Button/Button';
import { Menu } from '../Menu/Menu';
import { MenuItem } from '../MenuItem/MenuItem';
import NodeIcon from '../NodeIcon/NodeIcon';
import type { NodeOverviewProps } from '../consts';
import {
  buttonContainer,
  container,
  iconContainer,
  infoStyle,
  menuButtonContainer,
  popupContainer,
  textContainer,
  titleContainer,
  titleStyle,
  versionContainer,
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
    nodeId,
    name,
    displayName,
    title,
    iconUrl,
    info,
    screenType,
    status,
    version,
    onAction,
  } = nodeOverview;

  const [isSettingsDisplayed, setIsSettingsDisplayed] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { t: g } = useTranslation('genericComponents');
  const startButtonProps: ButtonProps = {
    label: g('Resume'),
    iconId: 'play',
    onClick: () => {
      if (onAction) onAction('start', nodeId);
    },
  };
  const stopButtonProps: ButtonProps = {
    label: g('Stop'),
    iconId: 'stop',
    onClick: () => {
      if (onAction) onAction('stop', nodeId);
    },
  };
  const transitionButtonProps: ButtonProps = {
    label: status.stopping ? g('Stopping...') : g('Starting...'),
    iconId: 'sync',
  };
  let startStopButtonProps: ButtonProps;
  if (status.error) {
    startStopButtonProps = startButtonProps; // show both buttons in case of error
  } else if (status.stopping || status.starting) {
    startStopButtonProps = transitionButtonProps;
  } else if (status.stopped) {
    startStopButtonProps = startButtonProps;
  } else {
    startStopButtonProps = stopButtonProps;
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
        <NodeIcon iconId={name} size="large" iconUrl={iconUrl} />
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
          <div className={menuButtonContainer}>
            <Button
              label={g('UpdateAvailable')}
              type="primary"
              size="small"
              onClick={() => {
                dispatch(
                  setModalState({
                    isModalOpen: true,
                    screen: {
                      route: modalRoutes.update,
                      type: 'modal',
                      data: {
                        deeplink: 'update',
                        nodeOverview,
                      },
                    },
                  }),
                );
              }}
            />
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
            disabled={
              isPodmanRunning === false ||
              startStopButtonProps.iconId === 'sync'
            }
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
            id="nodeSettingsBtn"
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
            <div className={popupContainer}>
              <Menu width={156}>
                {screenType === 'client' && (
                  <>
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
                    <MenuItem
                      text={g('CheckForUpdates')}
                      onClick={async () => {
                        // dispatch checkForUpdates, show loading icon?, then show success or error in-line?
                        setIsSettingsDisplayed(false);
                        const isUpdateAvailable: NodeSpecification | undefined =
                          await electron.getCheckForControllerUpdate(nodeId);
                        console.log('isUpdateAvailable:', isUpdateAvailable);
                        dispatch(
                          setModalState({
                            isModalOpen: true,
                            screen: {
                              route: modalRoutes.update,
                              type: 'modal',
                              data: {
                                deeplink: 'check',
                                nodeOverview,
                              },
                            },
                          }),
                        );
                      }}
                    />
                  </>
                )}
                {screenType === 'nodePackage' && (
                  <MenuItem
                    id="removeNodeMenuItem"
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
