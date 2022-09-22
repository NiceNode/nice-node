import { blockContainer, inlineContainer, linkText } from './externalLink.css';
import { ReactComponent as ExternalIcon } from '../../../assets/images/icons/External.svg';

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
}

const ExternalLink = ({ url, text, inline }: ExternalLinkProps) => {
  const classContainer = inline ? inlineContainer : blockContainer;
  return (
    <div className={classContainer}>
      <a className={linkText} href={url} target="_blank" rel="noreferrer">
        {text}
      </a>
      <ExternalIcon />
    </div>
  );
};
export default ExternalLink;
