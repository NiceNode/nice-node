import { Icon } from '../Icon/Icon';
import { copyButton } from './copyButton.css';

export interface CopyButtonProps {
  onClick?: () => void;
}

const CopyButton = ({ onClick }: CopyButtonProps) => {
  return (
    <button type="button" className={copyButton} onClick={onClick}>
      <Icon iconId={'copy'} />
    </button>
  );
};

export default CopyButton;
