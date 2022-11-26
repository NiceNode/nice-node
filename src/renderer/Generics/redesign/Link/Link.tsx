/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { IconId } from 'renderer/assets/images/icons';
import {
  blockContainer,
  inlineContainer,
  linkText,
  iconStyle,
} from './link.css';
import { Icon } from '../Icon/Icon';

// todo: variants for downloads or internal links
export interface LinkProps {
  /**
   * Url (external)
   */
  url?: string;
  /**
   * The link text
   */
  text?: string;
  /**
   * Inline the link
   */
  inline?: boolean;
  leftIconId?: IconId;
  rightIconId?: IconId;
  onClick?: () => void;
  /**
   * Is it a dropdown link?
   */
  dropdown?: boolean;
  /**
   * Hide external link icon?
   */
  hideIcon?: boolean;
  /**
   * Dropdown link support
   */
  isDown?: boolean;
  /**
   * Should it display small?
   */
  small?: boolean;
  /**
   * Does the link remove or delete something?
   */
  danger?: boolean;
  /**
   * Does the link have an underline?
   */
  underline?: boolean;
}

const Link = ({
  url,
  text,
  inline,
  onClick,
  dropdown = false,
  isDown,
  leftIconId,
  rightIconId,
  small = false,
  danger = false,
  underline = false,
  hideIcon = false,
}: LinkProps) => {
  const classContainer = inline ? inlineContainer : blockContainer;

  const linkProps = { href: '', target: '', rel: '', onClick: (e: any) => {} };
  if (url) {
    linkProps.href = url;
    linkProps.target = '_blank';
    linkProps.rel = 'noreferrer';
  } else {
    linkProps.href = 'javascript:void(0);';
    linkProps.onClick = (e) => {
      console.log('Internal link a onclik');
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    };
  }

  const smallStyle = small ? 'small' : '';
  const dangerStyle = danger ? 'danger' : '';
  const underlineStyle = underline ? 'underline' : '';

  const getIcon = (type: string) => {
    let iconId: IconId;
    switch (type) {
      case 'down':
      case 'up':
        iconId = type;
        break;
      case 'rightIconId':
        iconId = rightIconId;
        break;
      case 'leftIconId':
        iconId = leftIconId;
        break;
      default:
        iconId = 'external';
    }
    return (
      <div className={[iconStyle, small].join(' ')}>
        <Icon iconId={iconId} />
      </div>
    );
  };

  const renderDropdownIcon = () => {
    if (dropdown) {
      if (isDown === true) {
        return getIcon('down');
      }
      return getIcon('up');
    }
    return null;
  };

  return (
    <div
      className={[classContainer, smallStyle].join(' ')}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      {leftIconId && getIcon(leftIconId)}
      <a
        className={[linkText, dangerStyle, underlineStyle].join(' ')}
        {...linkProps}
      >
        {text}
      </a>
      {rightIconId && getIcon(rightIconId)}
      {renderDropdownIcon()}
      {url && !hideIcon && getIcon('external')}
    </div>
  );
};
export default Link;
