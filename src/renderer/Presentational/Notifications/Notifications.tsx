// import LabelValues from '../../Generics/redesign/LabelValues/LabelValues';
import {
  NotificationItem,
  NotificationItemProps,
} from '../../Generics/redesign/NotificationItem/NotificationItem';
import Button from '../../Generics/redesign/Button/Button';
import {
  container,
  headerContainer,
  spacer,
  titleStyle,
} from './notifications.css';

export type NotificationsType = {
  data: NotificationItemProps[];
  updateNotifications: () => void;
  onSettingsClick: () => void;
};

const Notifications = (props: NotificationsType) => {
  const { data, updateNotifications } = props;
  return (
    <div className={container}>
      <div className={headerContainer}>
        <div className={titleStyle}>Notifications</div>
        <div className={spacer} />
        <Button
          label="Mark all as read"
          iconId="check"
          variant="icon-left"
          size="small"
          onClick={updateNotifications}
        />
        <Button
          iconId="settings"
          variant="icon"
          size="small"
          onClick={onSettingsClick}
        />
      </div>
      {data.map((item) => {
        return <NotificationItem {...item} />;
      })}
    </div>
  );
};
export default Notifications;
