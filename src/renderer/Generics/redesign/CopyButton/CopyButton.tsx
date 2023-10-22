import { useState } from 'react';
import { Icon } from '../Icon/Icon';
import { checkIcon, copyIcon, copyMessage } from './copyButton.css';

export interface CopyButtonProps {
  data: string;
}

const CopyButton = ({ data }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async () => {
    if (!isCopied) {
      await navigator.clipboard.writeText(data);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div
      className={copyIcon}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={isCopied ? checkIcon : copyIcon}>
        <Icon iconId={isCopied ? 'check' : 'copy'} />
      </div>
      <div
        className={copyMessage}
        style={{ display: isCopied ? 'block' : 'none' }}
      >
        Copied!
      </div>
    </div>
  );
};

export default CopyButton;
