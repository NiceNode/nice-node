import Button from '../Button/Button';
import {
  container,
  pathAndChangeContainer,
  freeStorageSpaceFontStyle,
} from './folderInput.css';
import Input from './Input';

export interface FolderInputProps {
  /**
   *  The folder path
   */
  placeholder?: string;
  /**
   *  Free storage space of the storage device where the folder
   *  is located (mounted).
   */
  freeStorageSpaceMBs?: number;
  /**
   *  Provide to allow the user to change the folder location
   */
  onClickChange?: () => void;
}

const FolderInput = ({
  placeholder,
  freeStorageSpaceMBs,
  onClickChange,
}: FolderInputProps) => {
  return (
    <div className={container}>
      <div className={pathAndChangeContainer}>
        <div style={{ flexGrow: 1 }}>
          <Input disabled placeholder={placeholder} />
        </div>
        <Button
          size="small"
          label="Change..."
          disabled={!onClickChange}
          onClick={onClickChange}
        />
      </div>
      {freeStorageSpaceMBs && (
        <span className={freeStorageSpaceFontStyle}>
          {Math.round(freeStorageSpaceMBs)}MB available storage
        </span>
      )}
    </div>
  );
};
export default FolderInput;
