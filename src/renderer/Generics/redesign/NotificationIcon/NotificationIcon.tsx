import { useTranslation } from 'react-i18next';
import { IconId } from 'renderer/assets/images/icons';
import {
  iconBackground,
  hasStatusStyle,
  smallStyle,
  statusStyle,
  containerStyle,
} from './notificationIcon.css';
import { Icon } from '../Icon/Icon';
import { vars, common } from '../theme.css';

export interface NotificationIconProps {
  /**
   * What's the status?
   */
  status: 'info' | 'completed' | 'download' | 'warning' | 'error';
  /**
   * Is it unread?
   */
  unread?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const NotificationIcon = ({ status, unread }: NotificationIconProps) => {
  const { t } = useTranslation('genericComponents');

  let statusComponent = null;
  let unreadStyle = null;
  if (unread) {
    statusComponent = <div className={statusStyle} />;
    unreadStyle = hasStatusStyle;
  }

  const iconObject = {
    color: '',
    backgroundColor: '',
    iconId: 'infocirclefilled',
  };
  switch (status) {
    case 'info':
      iconObject.color = common.color.green500;
      iconObject.backgroundColor = 'rgba(18, 186, 108, 0.08)';
      iconObject.iconId = 'infocirclefilled';
      break;
    case 'completed':
      iconObject.color = common.color.green500;
      iconObject.backgroundColor = 'rgba(18, 186, 108, 0.08)';
      iconObject.iconId = 'checkcirclefilled';
      break;
    case 'download':
      iconObject.color = common.color.blue500;
      iconObject.backgroundColor = 'rgba(19, 122, 248, 0.08)';
      iconObject.iconId = 'download1';
      break;
    case 'warning':
      iconObject.color = common.color.orange400;
      iconObject.backgroundColor = 'rgba(247, 144, 9, 0.12)';
      iconObject.iconId = 'warningcirclefilled';
      break;
    default:
  }

  return (
    <div className={containerStyle}>
      {/* https://stackoverflow.com/questions/6040005/relatively-position-an-element-without-it-taking-up-space-in-document-flow */}
      <div style={{ position: 'relative', width: 0, height: 0 }}>
        {statusComponent}
      </div>
      <div
        className={[iconBackground, smallStyle, unreadStyle].join(' ')}
        style={{
          backgroundColor: iconObject.backgroundColor,
          color: iconObject.color,
        }}
      >
        <Icon iconId={iconObject.iconId as IconId} />
      </div>
    </div>
  );
};
