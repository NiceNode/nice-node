import { Icon } from '../Icon/Icon';
import { blockContainer, inlineContainer, linkText } from './externalLink.css';

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
      // biome-ignore lint: useSemanticElements
      role="button"
      tabIndex={0}
    >
      {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
      <a className={linkText} href="javascript:void(0);">
        {text}
      </a>
      {isDown === true ? <Icon iconId="down" /> : <Icon iconId="up" />}
    </div>
  );
};
export default DropdownLink;
