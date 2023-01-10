// import LabelValues from '../../Generics/redesign/LabelValues/LabelValues';
import { NotificationItem } from '../../Generics/redesign/NotificationItem/NotificationItem';
import Button from '../../Generics/redesign/Button/Button';
import {
  container,
  headerContainer,
  spacer,
  titleStyle,
} from './notifications.css';

// TODO: process retrieved client data into this format
export type NotificationsType = {};

const Notifications = (props) => {
  // TODO: retrieve initial data for all pages

  const { array } = props;

  console.log(props);

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
          onClick={() => {}}
        />
        <Button
          iconId="settings"
          variant="icon"
          size="small"
          onClick={() => {}}
        />
      </div>
      {array.map((item) => {
        console.log(item);
        return <NotificationItem {...item} />;
      })}
    </div>
  );
};
export default Notifications;
