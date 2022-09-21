import { container, linkText } from './externalLink.css';
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
}

const ExternalLink = ({ url, text }: ExternalLinkProps) => {
  return (
    <div className={container}>
      <a className={linkText} href={url} target="_blank" rel="noreferrer">
        {text}
      </a>
      <ExternalIcon />
    </div>
  );
};
export default ExternalLink;
