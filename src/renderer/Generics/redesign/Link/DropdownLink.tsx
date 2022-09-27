/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { blockContainer, inlineContainer, linkText } from './externalLink.css';
import { ReactComponent as DownIcon } from '../../../assets/images/icons/Down.svg';
import { ReactComponent as UpIcon } from '../../../assets/images/icons/Up.svg';

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
      {isDown === true ? <DownIcon /> : <UpIcon />}
    </div>
  );
};
export default DropdownLink;
