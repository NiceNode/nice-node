import { useState } from 'react';
import { Icon } from '../Icon/Icon';
import { checkIcon, copyIcon } from './copyButton.css';

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

  return (
    <div className={isCopied ? checkIcon : copyIcon} onClick={handleClick}>
      <Icon iconId={isCopied ? 'check' : 'copy'} />
    </div>
  );
};

export default CopyButton;
