/* eslint-disable no-script-url */
import { blockContainer, inlineContainer, linkText } from './externalLink.css';
import { Icon } from '../Icon/Icon';

// todo: variants for downloads or internal links
export interface DropdownLinkProps {
  /**
   * The link text
   */
  text?: string;
  /**
   * Inline the link
   */
  inline?: boolean;
  onClick?: () => void;
  isDown?: boolean;
}

const DropdownLink = ({ text, inline, onClick, isDown }: DropdownLinkProps) => {
  const classContainer = inline ? inlineContainer : blockContainer;
  return (
    <div
      className={classContainer}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      <a className={linkText} href="javascript:void(0);">
        {text}
      </a>
      {isDown === true ? <Icon iconId="down" /> : <Icon iconId="up" />}
    </div>
  );
};
export default DropdownLink;
