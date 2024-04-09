/* eslint-disable no-script-url */
import { dangerLinkText, linkText } from './internalLink.css';

export interface InternalLinkProps {
  /**
   * The link url
   */
  onClick: () => void;
  /**
   * The link text
   */
  text?: string;
  /**
   * Does the link remove or delete something?
   */
  danger?: boolean;
}

const InternalLink = ({ onClick, text, danger }: InternalLinkProps) => {
  const linkStyles = [linkText];
  if (danger) {
    linkStyles.push(dangerLinkText);
  }
  return (
    // biome-ignore lint/a11y/useValidAnchor: <explanation>
    <a
      className={linkStyles.join(' ')}
      href="javascript:void(0);"
      onClick={(e) => {
        console.log('Internal link a onclik');
        e.preventDefault();
        onClick();
      }}
    >
      {text}
    </a>
  );
};
export default InternalLink;
