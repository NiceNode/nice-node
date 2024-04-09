import { Icon } from '../Icon/Icon';
import { blockContainer, inlineContainer, linkText } from './externalLink.css';

// todo: variants for downloads or internal links
export interface ExternalLinkProps {
  /**
   * The link url
   */
  url: string;
  /**
   * The link text
   */
  text?: string;
  /**
   * Inline the link
   */
  inline?: boolean;
  /**
   * Hide the external link icon
   */
  hideIcon?: boolean;
}

const ExternalLink = ({ url, text, inline, hideIcon }: ExternalLinkProps) => {
  const classContainer = inline ? inlineContainer : blockContainer;
  return (
    <div className={classContainer}>
      <a className={linkText} href={url} target="_blank" rel="noreferrer">
        {text}
      </a>
      {!hideIcon && <Icon iconId="external" />}
    </div>
  );
};
export default ExternalLink;
