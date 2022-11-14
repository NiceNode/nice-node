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
  freeStorageSpaceGBs?: number;
  /**
   *  Is this input field disabled?
   */
  disabled?: boolean;
  /**
   *  Provide to allow the user to change the folder location
   */
  onClickChange?: () => void;
}

const FolderInput = ({
  placeholder,
  freeStorageSpaceGBs,
  disabled,
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
          disabled={!onClickChange || disabled}
          onClick={onClickChange}
        />
      </div>
      {freeStorageSpaceGBs && (
        <span className={freeStorageSpaceFontStyle}>
          {Math.round(freeStorageSpaceGBs)}GB available storage
        </span>
      )}
    </div>
  );
};
export default FolderInput;
