/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { IconId } from 'renderer/assets/images/icons';
import {
  blockContainer,
  inlineContainer,
  linkText,
  iconStyle,
  dangerLinkText,
} from './linking.css';
import { Icon } from '../Icon/Icon';

// todo: variants for downloads or internal links
export interface LinkingProps {
  /**
   * Url (having this makes link become external)
   */
  url?: string;
  /**
   * The link text
   */
  text: string;
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

const Linking = ({
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
}: LinkingProps) => {
  const classContainer = inline ? inlineContainer : blockContainer;
  const containerStyle = danger ? dangerLinkText : linkText;

  const linkProps = {
    href: 'javascript:void(0);',
    target: '',
    rel: '',
    onClick: (_e: any) => {},
  };
  if (url) {
    linkProps.href = url;
    linkProps.target = '_blank';
    linkProps.rel = 'noreferrer';
  } else {
    linkProps.onClick = (e) => {
      console.log('Internal link a onclik');
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    };
  }

  const smallStyle = small ? 'small' : '';
  const underlineStyle = underline || url ? 'underline' : '';

  const getIcon = (type: string) => {
    let iconId: IconId;
    switch (type) {
      case 'down':
      case 'up':
        iconId = type;
        break;
      case 'rightIconId':
        if (rightIconId) {
          // check for undefined here
          iconId = rightIconId;
        } else {
          return null;
        }
        break;
      case 'leftIconId':
        if (leftIconId) {
          // check for undefined here
          iconId = leftIconId;
        } else {
          return null;
        }
        break;
      default:
        iconId = 'external';
    }
    return (
      <div className={[iconStyle, smallStyle].join(' ')}>
        {/* make sure icon svg doesn't have width and height set */}
        <Icon iconId={iconId} />
      </div>
    );
  };

  const getDropdown = () => {
    if (dropdown) {
      return isDown === true ? getIcon('down') : getIcon('up');
    }
    return null;
  };

  return (
    <div className={[classContainer, containerStyle, smallStyle].join(' ')}>
      {leftIconId && getIcon('leftIconId')}
      <a className={[containerStyle, underlineStyle].join(' ')} {...linkProps}>
        {text}
      </a>
      {rightIconId && getIcon('rightIconId')}
      {getDropdown()}
      {url && !hideIcon && getIcon('external')}
    </div>
  );
};
export default Linking;
