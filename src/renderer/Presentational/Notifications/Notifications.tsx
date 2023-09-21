import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from '../../Generics/redesign/Menu/Menu';
import { MenuItem } from '../../Generics/redesign/MenuItem/MenuItem';
import { HorizontalLine } from '../../Generics/redesign/HorizontalLine/HorizontalLine';
import { useAppDispatch } from '../../state/hooks';
import { setModalState } from '../../state/modal';
import {
  NotificationItem,
  NotificationItemProps,
} from '../../Generics/redesign/NotificationItem/NotificationItem';
import Button from '../../Generics/redesign/Button/Button';
import {
  headerContainer,
  spacer,
  titleStyle,
  emptyContainer,
  popupContainer,
  menuButtonContainer,
  contentContainer,
  titleFont,
  descriptionFont,
} from './notifications.css';

export type NotificationsType = {
  data: NotificationItemProps[];
  markAllNotificationsAsRead: () => void;
  removeNotifications: () => void;
  onNotificationItemClick: () => void;
};

const Notifications = (props: NotificationsType) => {
  const {
    data,
    markAllNotificationsAsRead,
    onNotificationItemClick,
    removeNotifications,
  } = props;
  const [isSettingsDisplayed, setIsSettingsDisplayed] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const areAllNotificationsRead = () => {
    return data.every((item) => item.unread === false);
  };

  const renderContent = () => {
    if (data.length > 0) {
      return (
        <div>
          {data.map((item) => {
            return (
              <NotificationItem {...item} onClick={onNotificationItemClick} />
            );
          })}
        </div>
      );
    }
    return (
      <div className={emptyContainer}>
        <div className={contentContainer}>
          <div className={titleFont}>{t('NoNotificationsYet')}</div>
          <div className={descriptionFont}>{t('WellLetYouKnow')}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={headerContainer}>
        <div className={titleStyle}>{t('Notifications')}</div>
        <div className={spacer} />
        <div
          className={menuButtonContainer}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsSettingsDisplayed(false);
            }
          }}
        >
          <Button
            iconId="ellipsis"
            variant="icon"
            size="small"
            onClick={() => {
              setIsSettingsDisplayed(!isSettingsDisplayed);
            }}
          />
          {isSettingsDisplayed && (
            // tabindex hack to keep focus, and allow blur behavior
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            <div className={popupContainer} tabIndex={0}>
              <Menu width={208}>
                <MenuItem
                  iconId="checkdouble"
                  text={t('MarkAllAsRead')}
                  onClick={() => {
                    setIsSettingsDisplayed(false);
                    markAllNotificationsAsRead();
                  }}
                  disabled={areAllNotificationsRead()}
                />
                <MenuItem
                  iconId="close"
                  text={t('ClearNotifications')}
                  onClick={() => {
                    setIsSettingsDisplayed(false);
                    removeNotifications();
                  }}
                  disabled={data.length === 0}
                />
                <HorizontalLine type="menu" />
                <MenuItem
                  iconId="settings"
                  text={t('NotificationPreferences')}
                  onClick={() => {
                    setIsSettingsDisplayed(false);
                    dispatch(
                      setModalState({
                        isModalOpen: true,
                        screen: { route: 'preferences', type: 'modal' },
                      }),
                    );
                  }}
                />
              </Menu>
            </div>
          )}
        </div>
      </div>
      {renderContent()}
    </>
  );
};
export default Notifications;
